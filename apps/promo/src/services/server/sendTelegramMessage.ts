import fs from "fs/promises";
import { SendOptions } from "@/types/types";
import getDeviceType from "./getDeviceType";
import escapeHtml from "./escapeHtml";

export async function sendTelegramMessage({
  fields,
  files,
  geo,
  size,
  ip,
  timeOnSite,
  req,
}: SendOptions) {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const tgBaseUrl = (process.env.TELEGRAM_API_URL || "https://api.telegram.org").replace(/\/$/, "");
  const phone = escapeHtml(String(fields.phone).trim());
  const name = escapeHtml(String(fields.name).trim());
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
    if (displayBlocks) displayBlocks += "\n";
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

  const message = `
<b>📋 Новая заявка с сайта</b>
<b>Дата:</b> ${new Date().toLocaleDateString("ru-RU", { timeZone: "Europe/Moscow" })}
<b>Время:</b> ${new Date().toLocaleTimeString("ru-RU", { timeZone: "Europe/Moscow" })}
<b>WEB:</b> ${escapeHtml(req.headers["host"])}
<b>Страница:</b> ${escapeHtml(pageName)}
<b>Форма:</b> ${escapeHtml(cleanBlock)}
<b>Способ:</b> ${escapeHtml(displayMethod)}
<b>Имя:</b> ${escapeHtml(name)}
<b>Телефон:</b> <a href="tel:+${escapeHtml(phone)}">+${escapeHtml(phone)}</a>
${fields.question ? `<b>Вопрос:</b> ${escapeHtml(String(fields.question).trim())}\n` : ""}<b>ID пользователя в Яндекс метрике:</b> ${escapeHtml(fields.ym_uid || "Неизвестно")}
<b>ID визита Roistat:</b> ${escapeHtml(fields.roistat_visit || "Неизвестно")}

<b>📁 Прикреплено файлов:</b> ${files?.length ? files.length + " шт." : "Нет"}
<b>🕰 ВРЕМЯ НА САЙТЕ:</b> ${escapeHtml(timeOnSite)}
${hasQuiz ? `
<b>⭐ КВИЗ</b>
<b>Мебель:</b> ${escapeHtml(modelsVal)}
<b>Стиль интерьера:</b> ${escapeHtml(stylesVal)}
<b>Дизайн-проект:</b> ${escapeHtml(designVal)}
<b>Материалы:</b> ${escapeHtml(materialsVal)}
<b>Стадия ремонта:</b> ${escapeHtml(stageVal)}
<b>Сроки:</b> ${escapeHtml(timingVal)}
` : ""}
<b>🎯 ЦЕЛИ КОНТЕНТ</b>
${escapeHtml(displayContent)}

<b>🎯 ЦЕЛИ БЛОКИ</b>
${escapeHtml(displayBlocks)}

<b>🌍 ГЕОГРАФИЯ</b>
<b>Страна:</b> ${escapeHtml(geo?.country || "Неизвестно")}
<b>Регион:</b> ${escapeHtml(geo?.regionName || "Неизвестно")}
<b>Город:</b> ${escapeHtml(geo?.city || "Неизвестно")}
<b>Координаты:</b> lat ${geo?.lat || "?"}, lon ${geo?.lon || "?"}
<b>Яндекс Карта:</b> <a href="https://yandex.ru/maps/?pt=${geo.lon},${geo.lat}&z=17&l=map">Открыть</a>

<b>🖥 ТЕХНОЛОГИИ:</b>
<b>IP:</b> ${escapeHtml(ip || "Неизвестно")}
<b>UA:</b> ${escapeHtml(req.headers["user-agent"] || "Неизвестно")}
<b>Устройство:</b> ${escapeHtml(deviceType)}
<b>Размер:</b> ${escapeHtml(size || "Неизвестно")}
<b>Браузер:</b> ${escapeHtml(req.headers["sec-ch-ua"] || "Неизвестно")}
<b>Откуда:</b> ${escapeHtml(source)}

<b>🖍 UTM-МЕТКИ</b>
<b>UTM source:</b> ${escapeHtml(fields?.utm.source || "")}
<b>UTM medium:</b> ${escapeHtml(fields?.utm.medium || "")}
<b>UTM campaign:</b> ${escapeHtml(fields?.utm.campaign || "")}
<b>UTM content:</b> ${escapeHtml(fields?.utm.content || "")}
<b>UTM term:</b> ${escapeHtml(fields?.utm.term || "")}
<b>Source:</b> ${escapeHtml(fields?.utm.source_d || "")}
<b>Roistat pos:</b> ${escapeHtml(fields?.utm.roistat_pos || "")}
`;

  if (!telegramToken || !chatId) {
    throw new Error("TELEGRAM_TOKEN или TELEGRAM_CHAT_ID не заданы");
  }

  const tgResponse = await fetch(
    `https://api.telegram.org/bot${telegramToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    },
  );

  const tgData = await tgResponse.json();
  if (!tgResponse.ok) {
    console.error("Ошибка Telegram API:", tgData);
    throw new Error("Ошибка при отправке в Telegram");
  }

  if (files && files.length > 0) {
    for (const file of files) {
      try {
        const fileBuffer = await fs.readFile(file.filepath);
        const blob = new Blob([fileBuffer]);
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("document", blob, file.originalFilename || "file");

        const docResponse = await fetch(
          `https://api.telegram.org/bot${telegramToken}/sendDocument`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!docResponse.ok) {
          console.error(`Ошибка при отправке файла ${file.originalFilename} в Telegram:`, await docResponse.json());
        }
      } catch (err) {
        console.error(`Ошибка при чтении/отправке файла ${file.originalFilename}:`, err);
      }
    }
  }

  return tgData;
}
