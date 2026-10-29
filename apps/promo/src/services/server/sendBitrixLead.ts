import escapeHtml from "./escapeHtml";

export async function sendBitrixLead({
  fields,
  timeOnSite,
}: {
  fields: any;
  timeOnSite: string;
}) {
  const webhookUrl = process.env.BITRIX_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[Bitrix24] Integration skipped: BITRIX_WEBHOOK_URL env is not set.");
    return;
  }

  const phone = String(fields.phone || "").trim();
  const name = String(fields.name || "").trim();
  const block = String(fields.block || "Форма").replace(/<br\s*\/?>/gi, " ");
  const ymUid = String(fields.ym_uid || "").trim();
  const roistatVisit = String(fields.roistat_visit || "").trim();

  const utm = fields.utm || {};
  const utmSource = utm.source || "";
  const utmMedium = utm.medium || "";
  const utmCampaign = utm.campaign || "";
  const utmContent = utm.content || "";
  const utmTerm = utm.term || "";

  // Format Quiz data if present
  const modelsStorage = fields.modelsStorage || [];
  const stylesStorage = fields.stylesStorage || [];
  const designProjectStorage = fields.designProjectStorage || [];
  const materialsStorage = fields.materialsStorage || [];
  const stageStorage = fields.stageStorage || [];
  const timingStorage = fields.timingStorage || [];

  const modelsVal = Array.isArray(modelsStorage) ? modelsStorage.join(", ") : modelsStorage;
  const stylesVal = Array.isArray(stylesStorage) ? stylesStorage.join(", ") : stylesStorage;
  const designVal = Array.isArray(designProjectStorage) ? designProjectStorage.join(", ") : designProjectStorage;
  const materialsVal = Array.isArray(materialsStorage) ? materialsStorage.join(", ") : materialsStorage;
  const stageVal = Array.isArray(stageStorage) ? stageStorage.join(", ") : stageStorage;
  const timingVal = Array.isArray(timingStorage) ? timingStorage.join(", ") : timingStorage;

  const hasQuiz = fields.block === "Квиз" || (modelsVal && modelsVal.length > 0) || (stylesVal && stylesVal.length > 0);

  let commentsHtml = `
    <b>Имя:</b> ${escapeHtml(name)}<br>
    <b>Телефон:</b> +${escapeHtml(phone)}<br>
    <b>Форма:</b> ${escapeHtml(block)}<br>
    <b>Время на сайте:</b> ${escapeHtml(timeOnSite)}<br>
  `;

  if (fields.question) {
    commentsHtml += `<b>Вопрос:</b> ${escapeHtml(String(fields.question).trim())}<br>`;
  }

  if (hasQuiz) {
    commentsHtml += `<br><b>⭐ ОТВЕТЫ НА КВИЗ:</b><br>
      <b>Мебель:</b> ${escapeHtml(modelsVal || "—")}<br>
      <b>Стиль:</b> ${escapeHtml(stylesVal || "—")}<br>
      <b>Дизайн-проект:</b> ${escapeHtml(designVal || "—")}<br>
      <b>Материалы:</b> ${escapeHtml(materialsVal || "—")}<br>
      <b>Ремонт:</b> ${escapeHtml(stageVal || "—")}<br>
      <b>Сроки:</b> ${escapeHtml(timingVal || "—")}<br>
    `;
  }

  try {
    console.log("[Bitrix24] Creating contact...");
    // 1. Create Contact
    const contactRes = await fetch(`${webhookUrl}crm.contact.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          NAME: name,
          TYPE_ID: "CLIENT",
          SOURCE_ID: "WEB",
          PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
        },
      }),
    });

    const contactData = await contactRes.json();
    const contactId = contactData?.result;

    if (!contactId) {
      throw new Error(`Failed to create contact: ${JSON.stringify(contactData)}`);
    }

    console.log(`[Bitrix24] Contact created successfully with ID: ${contactId}. Creating deal...`);

    // 2. Create Deal and link it to the Contact
    const dealRes = await fetch(`${webhookUrl}crm.deal.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          TITLE: `Заявка с сайта (${block})`,
          CONTACT_ID: contactId,
          COMMENTS: commentsHtml,
          // Custom field mappings provided by Bitrix24 specialist
          UF_CRM_178587773884: roistatVisit, // Roistat visit id
          UF_CRM_1785863270687: ymUid,       // Client id Yandex Metrika
          // UTM tags mapping
          UTM_SOURCE: utmSource,
          UTM_MEDIUM: utmMedium,
          UTM_CAMPAIGN: utmCampaign,
          UTM_CONTENT: utmContent,
          UTM_TERM: utmTerm,
        },
        params: {
          REGISTER_SONET_EVENT: "Y",
        },
      }),
    });

    const dealData = await dealRes.json();
    const dealId = dealData?.result;

    if (!dealId) {
      throw new Error(`Failed to create deal: ${JSON.stringify(dealData)}`);
    }

    console.log(`[Bitrix24] Deal created successfully with ID: ${dealId}`);
    return { contactId, dealId };
  } catch (err) {
    console.error("[Bitrix24] Error creating lead/deal in Bitrix24:", err);
  }
}
