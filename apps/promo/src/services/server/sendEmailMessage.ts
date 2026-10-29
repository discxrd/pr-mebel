import nodemailer from "nodemailer";

import { SendOptions } from "@/types/types";
import escapeHtml from "./escapeHtml";
import getDeviceType from "./getDeviceType";

export async function sendEmailMessage({
  fields,
  files,
  geo,
  size,
  ip,
  timeOnSite,
  req,
}: SendOptions) {
  const ua = req.headers["user-agent"] || "";
  const deviceType = getDeviceType(ua);
  const referer = req.headers["referer"] || req.headers["referrer"];
  const source = referer?.includes("google")
    ? "Google"
    : referer?.includes("yandex")
      ? "Yandex"
      : referer?.includes("t.me")
        ? "Telegram"
        : referer?.includes("vk.com")
          ? "VK"
          : referer?.includes("whatsapp") || referer?.includes("wa.me")
            ? "WhatsApp"
            : "Неизвестно";

  let pageName = "главная";
  if (fields.pageUrl) {
    try {
      const url = new URL(fields.pageUrl);
      if (url.pathname.includes("/cooperation")) {
        pageName = "сотрудничество";
      } else if (url.pathname.includes("/thanks")) {
        pageName = "спасибо";
      } else if (url.pathname !== "/" && url.pathname !== "") {
        pageName = url.pathname.replace(/^\/|\/$/g, "");
      }
    } catch {
      if (fields.pageUrl.includes("cooperation")) {
        pageName = "сотрудничество";
      }
    }
  }

  let displayMethod = fields.method || "Звонок";
  if (displayMethod === "WhatsApp") displayMethod = "Вотсап";
  else if (displayMethod === "Telegram") displayMethod = "ТГ";
  else if (displayMethod === "Max") displayMethod = "Мах";

  const contentVisited: string[] = [];
  if (fields.project1) contentVisited.push("ЖК Садовые кварталы");
  if (fields.project2) contentVisited.push("ЖК Серебряный бор");
  if (fields.project3) contentVisited.push("ЖК Хорошевский");
  if (fields.project4) contentVisited.push("ЖК Пресня Сити");
  if (fields.project5) contentVisited.push("Частный интерьер");
  if (fields.project6) contentVisited.push("ЖК Сердце Столицы");

  if (fields.catalog1) contentVisited.push("Кухни");
  if (fields.catalog2) contentVisited.push("Гардеробные");
  if (fields.catalog3) contentVisited.push("Шкафы");
  if (fields.catalog4) contentVisited.push("Гостиные");
  if (fields.catalog5) contentVisited.push("Детские");
  if (fields.catalog6) contentVisited.push("Мебель для ванны");

  const displayContent = contentVisited.length > 0 ? contentVisited.join(", ") : "Нет";

  const blocksVisited: string[] = [];
  if (fields.visited_cooperation_page) blocksVisited.push("Сотрудничество");
  if (fields.visited_contacts_block) blocksVisited.push("Контакты");

  const menuVisited: string[] = [];
  if (fields.menuProjects) menuVisited.push("МН_Проекты");
  if (fields.menuCatalog) menuVisited.push("МН_Каталог");
  if (fields.menuAdvantages) menuVisited.push("МН_Преимущества");
  if (fields.menuCooperation) menuVisited.push("МН_Сотрудничество");
  if (fields.menuReviews) menuVisited.push("МН_Отзывы");
  if (fields.menuContacts) menuVisited.push("МН_Контакты");

  let displayBlocks = "";
  if (blocksVisited.length > 0) {
    displayBlocks += blocksVisited.join(", ");
  }
  if (menuVisited.length > 0) {
    if (displayBlocks) displayBlocks += "<br />";
    displayBlocks += menuVisited.join(" ");
  }
  if (!displayBlocks) {
    displayBlocks = "Нет";
  }

  const modelsVal = Array.isArray(fields.modelsStorage) ? fields.modelsStorage.join(", ") : fields.modelsStorage;
  const stylesVal = Array.isArray(fields.stylesStorage) ? fields.stylesStorage.join(", ") : fields.stylesStorage;
  const designVal = Array.isArray(fields.designProjectStorage) ? fields.designProjectStorage.join(", ") : fields.designProjectStorage;
  const materialsVal = Array.isArray(fields.materialsStorage) ? fields.materialsStorage.join(", ") : fields.materialsStorage;
  const stageVal = Array.isArray(fields.stageStorage) ? fields.stageStorage.join(", ") : fields.stageStorage;
  const timingVal = Array.isArray(fields.timingStorage) ? fields.timingStorage.join(", ") : fields.timingStorage;
  const hasQuiz = fields.block === "Квиз" || (modelsVal && modelsVal.length > 0) || (stylesVal && stylesVal.length > 0);

  const cleanBlock = (fields.block || "").replace(/<br\s*\/?>/gi, " ");

  const fileListHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;width:100%; max-width: 700px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <div style="padding: 20px; border: 1px solid #ccc;border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Дата:</strong> ${new Date().toLocaleDateString("ru-RU", { timeZone: "Europe/Moscow" })}</p>
        <p><strong>Время:</strong> ${new Date().toLocaleTimeString("ru-RU", { timeZone: "Europe/Moscow" })}</p>
        <p><strong>WEB:</strong> ${escapeHtml(req.headers["host"])}</p>
        <p><strong>Страница:</strong> ${escapeHtml(pageName)}</p>
        <p><strong>Форма:</strong> ${escapeHtml(cleanBlock)}</p>
        <p><strong>Способ:</strong> ${escapeHtml(displayMethod)}</p>
        <p><strong>Имя:</strong> ${fields.name}</p>
        <p><strong>Телефон:</strong> <a href="tel:${fields.phone}">+${fields.phone}</a></p>
        ${fields.question ? `<p><strong>Вопрос:</strong> ${escapeHtml(String(fields.question).trim())}</p>` : ""}
        <p><strong>ID пользователя в Яндекс метрике:</strong> ${escapeHtml(fields.ym_uid || "Неизвестно")}</p>
        <p><strong>ID визита Roistat:</strong> ${escapeHtml(fields.roistat_visit || "Неизвестно")}</p>
      </div>

      <div style="padding: 20px; border: 1px solid #ccc;border-radius: 5px;margin-bottom: 20px;">
        <p><strong>📁 Прикреплено файлов:</strong> ${files?.length ? files.length + " шт." : "Нет"}</p>
        <p><strong>🕰 ВРЕМЯ НА САЙТЕ:</strong> ${escapeHtml(timeOnSite)}</p>
      </div>

      ${hasQuiz ? `
      <div style="padding: 20px; border: 1px solid #ccc;border-radius: 5px;margin-bottom: 20px;">
        <h3>⭐ КВИЗ</h3>
        <p><strong>Мебель:</strong> ${escapeHtml(modelsVal)}</p>
        <p><strong>Стиль интерьера:</strong> ${escapeHtml(stylesVal)}</p>
        <p><strong>Дизайн-проект:</strong> ${escapeHtml(designVal)}</p>
        <p><strong>Материалы:</strong> ${escapeHtml(materialsVal)}</p>
        <p><strong>Стадия ремонта:</strong> ${escapeHtml(stageVal)}</p>
        <p><strong>Сроки:</strong> ${escapeHtml(timingVal)}</p>
      </div>
      ` : ""}

      <div style="padding: 20px; border: 1px solid #ccc;border-radius: 5px;margin-bottom: 20px;">
        <h3>🎯 ЦЕЛИ КОНТЕНТ</h3>
        <p>${escapeHtml(displayContent)}</p>
      </div>

      <div style="padding: 20px; border: 1px solid #ccc;border-radius: 5px;margin-bottom: 20px;">
        <h3>🎯 ЦЕЛИ БЛОКИ</h3>
        <p>${displayBlocks}</p>
      </div>

      <div style="padding: 20px; border: 1px solid #ccc;border-radius: 5px;margin-bottom: 20px;">
        <h3>🌍 ГЕОГРАФИЯ</h3>
        <p><strong>Страна:</strong> ${geo.country || "Неизвестно"}</p>
        <p><strong>Регион:</strong> ${geo.regionName || "Неизвестно"}</p>
        <p><strong>Город:</strong> ${geo.city || "Неизвестно"}</p>
        <p><strong>Координаты:</strong> ${geo.lat}, ${geo.lon}</p>
        <p><strong>Яндекс карта:</strong> <a href="https://yandex.ru/maps/?pt=${geo.lon},${geo.lat}&z=17&l=map">Открыть</a></p>
      </div>

      <div style="padding: 20px; border: 1px solid #ccc;border-radius: 5px;margin-bottom: 20px;">
        <h3>🖥️ ТЕХНОЛОГИИ</h3>
        <p><strong>IP:</strong> ${ip || "Неизвестно"}</p>
        <p><strong>UA:</strong> ${req.headers["user-agent"] || "Неизвестно"}</p>
        <p><strong>Устройство:</strong> ${deviceType}</p>
        <p><strong>Размер:</strong> ${size || "Неизвестно"}</p>
        <p><strong>Браузер:</strong> ${req.headers["sec-ch-ua"] || "Неизвестно"}</p>
        <p><strong>Откуда:</strong> ${source}</p>
      </div>

      <div style="padding: 20px; border: 1px solid #ccc;border-radius: 5px;margin-bottom: 20px;">
        <h3>🖍️ UTM-МЕТКИ</h3>
        <p><strong>UTM source:</strong> ${fields?.utm.source || ""}</p>
        <p><strong>UTM medium:</strong> ${fields?.utm.medium || ""}</p>
        <p><strong>UTM campaign:</strong> ${fields?.utm.campaign || ""}</p>
        <p><strong>UTM content:</strong> ${fields?.utm.content || ""}</p>
        <p><strong>UTM term:</strong> ${fields?.utm.term || ""}</p>
        <p><strong>Source:</strong> ${fields?.utm.source_d || ""}</p>
        <p><strong>Roistat pos:</strong> ${fields?.utm.roistat_pos || ""}</p>
      </div>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_MAIL_RU,
      pass: process.env.PASSWORD_MAIL_RU,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${fields.name}" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject: "nobielemebel.ru | Заявка от " + fields.name,
      html: fileListHtml,
      attachments: (files || []).map((file) => ({
        filename: file.originalFilename || "file",
        path: file.filepath,
      })),
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("[EMAIL_SEND_ERROR]", err);
    throw err; // Лучше бросить ошибку, чтобы не скрывать проблему
  }
}
