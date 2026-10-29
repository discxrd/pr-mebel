import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import formidable from "formidable";
import fs from "fs/promises";

import archiver from "archiver";
import { Readable } from "stream";
import { NextApiRequest, NextApiResponse } from "next";
export const config = {
  api: { bodyParser: false },
};
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      const form = formidable({ multiples: true });
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
    const uploadedFiles = files.files
      ? Array.isArray(files.files)
        ? files.files
        : [files.files]
      : [];

    const formatArray = (arr?: string | string[]) =>
      Array.isArray(arr)
        ? arr.length === 1
          ? arr[0]
          : arr.join(" , ")
        : arr || "Неизвестно";

    if (!s3Client) {
      throw new Error("S3 Client not found");
    }

    // --- 1. Загружаем все файлы в R2 ---
    const fileLinks = await Promise.all(
      uploadedFiles
        .filter((f): f is formidable.File => !!f)
        .map(async (file) => {
          try {
            const fileBuffer = await fs.readFile(file.filepath);
            const fileNameInR2 = `${fields.name}/${Date.now()}/${file.originalFilename || "file"}`;

            await s3Client.send(
              new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: fileNameInR2,
                Body: fileBuffer,
                ContentType: file.mimetype || "application/octet-stream",
              }),
            );

            const downloadUrl = await getSignedUrl(
              s3Client,
              new GetObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: fileNameInR2,
              }),
              { expiresIn: 3600 },
            );

            return {
              name: file.originalFilename || "Файл",
              key: fileNameInR2,
              url: downloadUrl,
            };
          } catch (error) {
            console.error(`[R2_UPLOAD_ERROR] ${file.originalFilename}:`, error);
            return null;
          }
        }),
    ).then((res) =>
      res.filter((f): f is { name: string; key: string; url: string } => !!f),
    );

    if (fileLinks.length > 0) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // месяцы с 0
      const year = String(now.getFullYear());
      const zipKey = `${year}-${month}-${day}/${fields.name}-archive.zip`;

      // --- 2. Создаём ZIP-архив в памяти (Buffer) ---
      const archive = archiver("zip", { zlib: { level: 9 } });

      // Добавляем файлы в архив по одному
      for (const file of fileLinks) {
        const response = await s3Client.send(
          new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: file.key,
          }),
        );

        if (!response.Body) continue;

        const webStream = response.Body.transformToWebStream();
        const readable = Readable.fromWeb(webStream as any);

        archive.append(readable, { name: file.name });
      }

      // Завершаем архив и получаем BUFFER
      const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        archive.on("data", (chunk) => chunks.push(chunk));
        archive.on("end", () => resolve(Buffer.concat(chunks)));
        archive.on("error", reject);
        archive.finalize();
      });

      // --- 3. Загружаем ZIP в R2 (как обычный буфер) ---
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: zipKey,
          Body: zipBuffer, // ← Теперь это просто буфер — никаких потоков!
          ContentType: "application/zip",
        }),
      );

      // --- 4. Генерируем URL для скачивания ZIP из R2 ---
      const zipDownloadUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: zipKey,
        }),
        { expiresIn: 3600 },
      );

      return res.status(200).json({
        success: true,
        message: "Данные успешно отправлены!",
        uploadUrl: zipDownloadUrl,
        key: zipKey,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
