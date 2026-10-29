// /pages/api/create-archive.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import archiver from "archiver";
import { Readable } from "stream";
import { NextApiRequest, NextApiResponse } from "next";

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
    const { name, fileKeys } = req.body;

    if (!name || !fileKeys || !Array.isArray(fileKeys)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());
    const zipKey = `${year}-${month}-${day}/${name}-archive.zip`;

    // Создаём ZIP-архив в памяти
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Добавляем файлы в архив
    for (const key of fileKeys) {
      try {
        const response = await s3Client.send(
          new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
          }),
        );

        if (!response.Body) continue;

        const webStream = response.Body.transformToWebStream();
        const readable = Readable.fromWeb(webStream as any);

        // Извлекаем имя файла из ключа
        const fileName = key.split("/").pop() || "file";
        archive.append(readable, { name: fileName });
      } catch (error) {
        console.error(`Failed to add file to archive: ${key}`, error);
      }
    }

    // Получаем буфер архива
    const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      archive.on("data", (chunk) => chunks.push(chunk));
      archive.on("end", () => resolve(Buffer.concat(chunks)));
      archive.on("error", reject);
      archive.finalize();
    });

    // Загружаем ZIP в R2
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: zipKey,
        Body: zipBuffer,
        ContentType: "application/zip",
      }),
    );

    // Генерируем URL для скачивания
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
      message: "Archive created successfully!",
      uploadUrl: zipDownloadUrl,
      key: zipKey,
    });
  } catch (error) {
    console.error("Archive creation error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create archive" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
