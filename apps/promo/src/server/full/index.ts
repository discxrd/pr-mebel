import getYandexClientID from "@/services/getYandexClientID";

export async function sendToTelegram({
  name,
  phone,
  width,
  height,
  files,
  block,
  uploadUrl,
  question,
  method = "Звонок",
  honeypot,
}: {
  name: string;
  phone: string;
  width: number;
  height: number;
  files?: any[];
  block: string;
  uploadUrl?: string | null;
  question?: string;
  method?: string;
  honeypot?: string;
}) {
  try {
    const utm = {
      source: String(localStorage.getItem("utm_source") || ""),
      medium: String(localStorage.getItem("utm_medium") || ""),
      campaign: String(localStorage.getItem("utm_campaign") || ""),
      content: String(localStorage.getItem("utm_content") || ""),
      term: String(localStorage.getItem("utm_term") || ""),
      source_d: String(localStorage.getItem("source") || ""),
      roistat_pos: String(localStorage.getItem("roistat_pos") || ""),
    };

    const yandexClientID = getYandexClientID();
    let roistatVisitID = "";
    if (typeof window !== "undefined") {
      const roistat = (window as any).roistat;
      if (roistat && typeof roistat.getVisit === "function") {
        try {
          roistatVisitID = String(roistat.getVisit() || "");
        } catch (e) {
          console.error("Error calling roistat.getVisit:", e);
        }
      }
      if (!roistatVisitID && typeof document !== "undefined") {
        roistatVisitID = document.cookie.match(/roistat_visit=([^;]+)/)?.[1] || "";
      }
    }

    // Отправляем сделку в Roistat через JS API для интеграции с Битрикс24
    if (typeof window !== "undefined" && (window as any).roistat) {
      try {
        (window as any).roistat.sendLead({
          phone: phone,
          name: name,
          comment: `Заявка с сайта (Блок: ${block})`,
          fields: {
            ym_client_id: yandexClientID,
            roistat_visit: roistatVisitID,
          }
        });
      } catch (err) {
        console.error("Error sending lead to Roistat:", err);
      }
    }

    const modelsStorage = JSON.parse(
      localStorage.getItem("modelsStorage") || "[]",
    );
    const stylesStorage = JSON.parse(
      localStorage.getItem("stylesStorage") || "[]",
    );
    const designProjectStorage = JSON.parse(
      localStorage.getItem("designProjectOptions") || "[]",
    );
    const materialsStorage = JSON.parse(
      localStorage.getItem("materialsOptions") || "[]",
    );
    const stageStorage = JSON.parse(
      localStorage.getItem("stageOptions") || "[]",
    );
    const timingStorage = JSON.parse(
      localStorage.getItem("timingOptions") || "[]",
    );

    const project1 = localStorage.getItem("promo/projects/1") === "true";
    const project2 = localStorage.getItem("promo/projects/2") === "true";
    const project3 = localStorage.getItem("promo/projects/3") === "true";
    const project4 = localStorage.getItem("promo/projects/4") === "true";
    const project5 = localStorage.getItem("promo/projects/5") === "true";
    const project6 = localStorage.getItem("promo/projects/6") === "true";

    const time_start = JSON.parse(localStorage.getItem("current_date") || "0");

    const visited_contacts_block = localStorage.getItem("visited_contacts_block") === "true";
    const visited_cooperation_page = localStorage.getItem("visited_cooperation_page") === "true";

    // Visited menu items
    const menuProjects = localStorage.getItem("promo/menu/#projects") === "true";
    const menuCatalog = localStorage.getItem("promo/menu/#catalog") === "true";
    const menuAdvantages = localStorage.getItem("promo/menu/#advantages") === "true";
    const menuCooperation = localStorage.getItem("promo/menu/cooperation") === "true";
    const menuReviews = localStorage.getItem("promo/menu/#reviews") === "true";
    const menuContacts = localStorage.getItem("promo/menu/#contacts") === "true";

    // Visited catalog categories
    const catalog1 = localStorage.getItem("promo/catalog/1") === "true";
    const catalog2 = localStorage.getItem("promo/catalog/2") === "true";
    const catalog3 = localStorage.getItem("promo/catalog/3") === "true";
    const catalog4 = localStorage.getItem("promo/catalog/4") === "true";
    const catalog5 = localStorage.getItem("promo/catalog/5") === "true";
    const catalog6 = localStorage.getItem("promo/catalog/6") === "true";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("width", String(width));
    formData.append("height", String(height));
    formData.append("block", block);
    formData.append("method", method);
    if (honeypot) formData.append("honeypot", honeypot);
    formData.append("modelsStorage", JSON.stringify(modelsStorage));
    formData.append("stylesStorage", JSON.stringify(stylesStorage));
    formData.append("designProjectStorage", JSON.stringify(designProjectStorage));
    formData.append("materialsStorage", JSON.stringify(materialsStorage));
    formData.append("stageStorage", JSON.stringify(stageStorage));
    formData.append("timingStorage", JSON.stringify(timingStorage));
    formData.append("project1", String(project1));
    formData.append("project2", String(project2));
    formData.append("project3", String(project3));
    formData.append("project4", String(project4));
    formData.append("project5", String(project5));
    formData.append("project6", String(project6));
    formData.append("time_start", String(time_start));
    formData.append("visited_contacts_block", String(visited_contacts_block));
    formData.append("visited_cooperation_page", String(visited_cooperation_page));
    formData.append("utm", JSON.stringify(utm));
    if (uploadUrl) formData.append("uploadUrl", uploadUrl);
    if (question) formData.append("question", question);
    formData.append("ym_uid", yandexClientID);
    formData.append("roistat_visit", roistatVisitID);

    // Append menu goals
    formData.append("menuProjects", String(menuProjects));
    formData.append("menuCatalog", String(menuCatalog));
    formData.append("menuAdvantages", String(menuAdvantages));
    formData.append("menuCooperation", String(menuCooperation));
    formData.append("menuReviews", String(menuReviews));
    formData.append("menuContacts", String(menuContacts));

    // Append catalog goals
    formData.append("catalog1", String(catalog1));
    formData.append("catalog2", String(catalog2));
    formData.append("catalog3", String(catalog3));
    formData.append("catalog4", String(catalog4));
    formData.append("catalog5", String(catalog5));
    formData.append("catalog6", String(catalog6));

    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const pageTitle = typeof window !== "undefined" ? document.title : "";
    formData.append("pageUrl", pageUrl);
    formData.append("pageTitle", pageTitle);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const res = await fetch("/api/send-full", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let errorMessage = "Ошибка при отправке данных";
      try {
        const errorData = await res.json();
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }
    localStorage.removeItem("modelsStorage");
    localStorage.removeItem("stylesStorage");
    localStorage.removeItem("designProjectOptions");
    localStorage.removeItem("materialsOptions");
    localStorage.removeItem("stageOptions");
    localStorage.removeItem("timingOptions");
    localStorage.removeItem("promo/projects/1");
    localStorage.removeItem("promo/projects/2");
    localStorage.removeItem("promo/projects/3");
    localStorage.removeItem("promo/projects/4");
    localStorage.removeItem("promo/projects/5");
    localStorage.removeItem("promo/projects/6");
    localStorage.removeItem("visited_contacts_block");
    localStorage.removeItem("visited_cooperation_page");
    localStorage.removeItem("current_date");

    // Clean up menu items and catalogs from local storage
    localStorage.removeItem("promo/menu/#projects");
    localStorage.removeItem("promo/menu/#catalog");
    localStorage.removeItem("promo/menu/#advantages");
    localStorage.removeItem("promo/menu/cooperation");
    localStorage.removeItem("promo/menu/#reviews");
    localStorage.removeItem("promo/menu/#contacts");
    localStorage.removeItem("promo/catalog/1");
    localStorage.removeItem("promo/catalog/2");
    localStorage.removeItem("promo/catalog/3");
    localStorage.removeItem("promo/catalog/4");
    localStorage.removeItem("promo/catalog/5");
    localStorage.removeItem("promo/catalog/6");

    return { success: true, message: "Данные успешно отправлены!" };
  } catch (error: any) {
    console.error("Send error:", error);
    return { success: false, error: error?.message || "Ошибка сети. Попробуйте еще раз." };
  }
}
