// /pages/api/generate-presigned-urls.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
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
    const { name, files } = req.body;

    if (!name || !files || !Array.isArray(files)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const urls = await Promise.all(
      files.map(async (file: { name: string; type: string }) => {
        const key = `${name}/${Date.now()}-${uuidv4()}-${file.name}`;
        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
          ContentType: file.type,
        });

        const url = await getSignedUrl(s3Client, command, {
          expiresIn: 3600 * 72,
        });

        return { key, url, name: file.name };
      }),
    );

    return res.status(200).json({ urls });
  } catch (error) {
    console.error("Presigned URL generation error:", error);
    return res.status(500).json({ error: "Failed to generate presigned URLs" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
