import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import { getGeoData } from "@/services/server/getGeoData";
import { sendTelegramMessage } from "@/services/server/sendTelegramMessage";
import { sendEmailMessage } from "@/services/server/sendEmailMessage";
import { sendConfig } from "@/config/sendConfig";
import { sendBitrixLead } from "@/services/server/sendBitrixLead";

export const config = {
  api: { bodyParser: false },
  runtime: "nodejs",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let uploadedFiles: formidable.File[] = [];

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

    uploadedFiles = files.files
      ? Array.isArray(files.files)
        ? (files.files as formidable.File[])
        : [files.files as formidable.File]
      : [];

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name || "";
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone || "";
    const width = Array.isArray(fields.width) ? fields.width[0] : fields.width || "";
    const height = Array.isArray(fields.height) ? fields.height[0] : fields.height || "";
    const time_start = Array.isArray(fields.time_start) ? fields.time_start[0] : fields.time_start || "";
    const block = Array.isArray(fields.block) ? fields.block[0] : fields.block || "";
    const ym_uid = Array.isArray(fields.ym_uid) ? fields.ym_uid[0] : fields.ym_uid || "";
    const roistat_visit = Array.isArray(fields.roistat_visit) ? fields.roistat_visit[0] : fields.roistat_visit || "";
    const question = Array.isArray(fields.question) ? fields.question[0] : fields.question || "";
    const pageUrl = Array.isArray(fields.pageUrl) ? fields.pageUrl[0] : fields.pageUrl || "";
    const pageTitle = Array.isArray(fields.pageTitle) ? fields.pageTitle[0] : fields.pageTitle || "";
    const honeypot = Array.isArray(fields.honeypot) ? fields.honeypot[0] : fields.honeypot || "";
    const dateStr = new Date().toLocaleDateString("ru-RU", { timeZone: "Europe/Moscow" });
    const cleanName = String(name).trim() ? String(name).trim().replace(/[\s\/:*?"<>|]/g, "_") : "Заявка";

    uploadedFiles.forEach((file, idx) => {
      if (file.originalFilename) {
        const extIndex = file.originalFilename.lastIndexOf(".");
        const ext = extIndex !== -1 ? file.originalFilename.substring(extIndex) : "";
        const baseName = extIndex !== -1 ? file.originalFilename.substring(0, extIndex) : file.originalFilename;
        file.originalFilename = `${cleanName}_${dateStr}_${baseName}${ext}`;
      } else {
        file.originalFilename = `${cleanName}_${dateStr}_файл_${idx + 1}`;
      }
    });

    const isDev = process.env.NODE_ENV === "development";
    const shouldSpamProtect = isDev ? sendConfig.dev.spamProtection : sendConfig.prod.spamProtection;
    const minTime = isDev ? sendConfig.dev.minSubmissionTimeMs : sendConfig.prod.minSubmissionTimeMs;

    if (shouldSpamProtect) {
      if (honeypot.trim().length > 0) {
        console.warn("⚠️ [Spam Protection] Honeypot triggered. Blocking request.");
        return res.status(400).json({ error: "Обнаружен автоспам." });
      }

      const submissionTimeMs = Date.now() - Number(time_start);
      if (time_start && submissionTimeMs < minTime) {
        const remainingSeconds = Math.ceil((minTime - submissionTimeMs) / 1000);
        console.warn(`⚠️ [Spam Protection] Form submitted too quickly (${submissionTimeMs}ms). Blocking request.`);
        return res.status(400).json({ 
          error: `Подождите ${remainingSeconds} сек.` 
        });
      }
    }

    if (!name || String(name).trim().length === 0) {
      return res.status(400).json({ error: "Имя обязательно для заполнения" });
    }
    if (!phone || String(phone).trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Телефон обязателен для заполнения" });
    }

    const parseJsonField = (field: any) => {
      try {
        const val = Array.isArray(field) ? field[0] : field;
        return val ? JSON.parse(val) : [];
      } catch {
        return [];
      }
    };

    const modelsStorage = parseJsonField(fields.modelsStorage);
    const stylesStorage = parseJsonField(fields.stylesStorage);
    const designProjectStorage = parseJsonField(fields.designProjectStorage);
    const materialsStorage = parseJsonField(fields.materialsStorage);
    const stageStorage = parseJsonField(fields.stageStorage);
    const timingStorage = parseJsonField(fields.timingStorage);
    const utm = parseJsonField(fields.utm);

    const project1 = (Array.isArray(fields.project1) ? fields.project1[0] : fields.project1) === "true";
    const project2 = (Array.isArray(fields.project2) ? fields.project2[0] : fields.project2) === "true";
    const project3 = (Array.isArray(fields.project3) ? fields.project3[0] : fields.project3) === "true";
    const project4 = (Array.isArray(fields.project4) ? fields.project4[0] : fields.project4) === "true";
    const project5 = (Array.isArray(fields.project5) ? fields.project5[0] : fields.project5) === "true";
    const project6 = (Array.isArray(fields.project6) ? fields.project6[0] : fields.project6) === "true";
    const visited_contacts_block = (Array.isArray(fields.visited_contacts_block) ? fields.visited_contacts_block[0] : fields.visited_contacts_block) === "true";
    const visited_cooperation_page = (Array.isArray(fields.visited_cooperation_page) ? fields.visited_cooperation_page[0] : fields.visited_cooperation_page) === "true";

    const method = Array.isArray(fields.method) ? fields.method[0] : fields.method || "Звонок";

    const menuProjects = (Array.isArray(fields.menuProjects) ? fields.menuProjects[0] : fields.menuProjects) === "true";
    const menuCatalog = (Array.isArray(fields.menuCatalog) ? fields.menuCatalog[0] : fields.menuCatalog) === "true";
    const menuAdvantages = (Array.isArray(fields.menuAdvantages) ? fields.menuAdvantages[0] : fields.menuAdvantages) === "true";
    const menuCooperation = (Array.isArray(fields.menuCooperation) ? fields.menuCooperation[0] : fields.menuCooperation) === "true";
    const menuReviews = (Array.isArray(fields.menuReviews) ? fields.menuReviews[0] : fields.menuReviews) === "true";
    const menuContacts = (Array.isArray(fields.menuContacts) ? fields.menuContacts[0] : fields.menuContacts) === "true";

    const catalog1 = (Array.isArray(fields.catalog1) ? fields.catalog1[0] : fields.catalog1) === "true";
    const catalog2 = (Array.isArray(fields.catalog2) ? fields.catalog2[0] : fields.catalog2) === "true";
    const catalog3 = (Array.isArray(fields.catalog3) ? fields.catalog3[0] : fields.catalog3) === "true";
    const catalog4 = (Array.isArray(fields.catalog4) ? fields.catalog4[0] : fields.catalog4) === "true";
    const catalog5 = (Array.isArray(fields.catalog5) ? fields.catalog5[0] : fields.catalog5) === "true";
    const catalog6 = (Array.isArray(fields.catalog6) ? fields.catalog6[0] : fields.catalog6) === "true";

    const data = {
      name,
      phone,
      block,
      question,
      modelsStorage,
      stylesStorage,
      designProjectStorage,
      materialsStorage,
      stageStorage,
      timingStorage,
      project1,
      project2,
      project3,
      project4,
      project5,
      project6,
      visited_contacts_block,
      visited_cooperation_page,
      method,
      menuProjects,
      menuCatalog,
      menuAdvantages,
      menuCooperation,
      menuReviews,
      menuContacts,
      catalog1,
      catalog2,
      catalog3,
      catalog4,
      catalog5,
      catalog6,
      utm,
      ym_uid,
      roistat_visit,
      uploadUrl: Array.isArray(fields.uploadUrl) ? fields.uploadUrl[0] : fields.uploadUrl || null,
      pageUrl,
      pageTitle,
    };

    const ip = String(
      req.headers["cf-connecting-ip"] ||
        req.headers["x-real-ip"] ||
        req.headers["x-client-ip"] ||
        (Array.isArray(req.headers["x-forwarded-for"])
          ? req.headers["x-forwarded-for"][0]
          : req.headers["x-forwarded-for"]?.split(",")[0]) ||
        "",
    );
    const geolocation = await getGeoData({
      ip,
    });

    const size = `${width}x${height}`;
    const diffMs = Date.now() - Number(time_start);
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const time_on_site_str = `${minutes}м ${seconds}с`;

    const shouldSendTelegram = isDev ? sendConfig.dev.sendTelegram : sendConfig.prod.sendTelegram;
    const shouldSendEmail = isDev ? sendConfig.dev.sendEmail : sendConfig.prod.sendEmail;

    if (isDev) {
      if (!shouldSendTelegram) console.log("ℹ️ [Dev Config] Отправка в Telegram отключена");
      if (!shouldSendEmail) console.log("ℹ️ [Dev Config] Отправка на Email отключена");
    }

    const sendPromises = [];

    if (shouldSendTelegram) {
      sendPromises.push(
        sendTelegramMessage({
          fields: data,
          files: uploadedFiles,
          size,
          geo: geolocation.data || {},
          ip,
          timeOnSite: time_on_site_str,
          req,
        })
      );
    }

    if (shouldSendEmail) {
      sendPromises.push(
        sendEmailMessage({
          fields: data,
          files: uploadedFiles,
          size,
          geo: geolocation.data || {},
          ip,
          timeOnSite: time_on_site_str,
          req,
        })
      );
    }

    if (process.env.BITRIX_WEBHOOK_URL) {
      sendPromises.push(
        sendBitrixLead({
          fields: data,
          timeOnSite: time_on_site_str,
        })
      );
    }

    const results = await Promise.allSettled(sendPromises);

    results.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(`Send promise #${idx} failed:`, result.reason);
      }
    });

    res
      .status(200)
      .json({ success: true, message: "Данные успешно отправлены!" });
  } catch (error) {
    console.error("Error sending form data:", error);
    res
      .status(500)
      .json({ error: "Ошибка при отправке данных. Попробуйте позже." });
  } finally {
    // Clean up temporary files
    for (const file of uploadedFiles) {
      try {
        await fs.unlink(file.filepath);
      } catch (err) {
        console.error(`Ошибка при удалении временного файла ${file.filepath}:`, err);
      }
    }
  }
}
