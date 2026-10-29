"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import s from "./formNotFile.module.css";
import { sendToTelegram } from "@/server/full";
import { formatPhone } from "@/lib/format-phone";
import { AnimatedTitle } from "@/components/animated-title";

export default function FormNotFile({ title }: { title?: string } = {}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [communicationMethod, setCommunicationMethod] = useState("Звонок");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const phoneDigits = formatPhone(phone).digits;

    if (!name.trim() || !phoneDigits) {
      setError("Заполните, пожалуйста, все поля");
      return;
    }

    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("7")) {
      setError("Неверный формат телефона");
      return;
    }

    if (!isAccepted) {
      setError("Необходимо согласиться с условиями");
      return;
    }

    setError("");
  }, [isAccepted, name, phone]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(event.target.value).formatted);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const phoneDigits = formatPhone(phone).digits;

    if (!name.trim() || !phoneDigits) {
      setError("Заполните, пожалуйста, все поля");
      return;
    }

    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("7")) {
      setError("Неверный формат телефона");
      return;
    }

    if (!isAccepted) {
      setError("Необходимо согласиться с условиями");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await sendToTelegram({
        name: name.trim(),
        phone: phoneDigits,
        width: window.screen.width * window.devicePixelRatio,
        height: window.screen.height * window.devicePixelRatio,
        block: title || "Форма без файла",
        method: communicationMethod,
      });

      if (response.success) {
        router.push("/thanks");
        return;
      }

      setError(response.error || "Произошла ошибка при отправке формы");
    } catch {
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={s.formSection}>
      <div className="container">
        <div className={s.containerWrapper}>
          <div className={s.title}>
            <AnimatedTitle>Хотите такую же <br /> мебель?</AnimatedTitle>
            <p>Заполните форму обратной связи и наши консультанты <br /> свяжутся с вами и подготовят индивидуальное предложение</p>
          </div>
          <div className={s.info}>
            <form onSubmit={handleSubmit} className={s.form}>
              <div className={s.nameSection}>
                <label htmlFor="name">
                  <input id="name" type="text" placeholder="Ваше имя" value={name} onChange={handleNameChange} required />
                </label>
                <label htmlFor="phone">
                  <input id="phone" type="text" placeholder="Ваш телефон" value={phone} onChange={handlePhoneChange} required />
                </label>
              </div>

              <div className={s.communicationsSection}>
                <h4>Предпочитаемый способ связи:</h4>
                <div className={s.communications}>
                  <label htmlFor="call">
                    <input type="radio" name="communications" id="call" checked={communicationMethod === "Звонок"} onChange={() => setCommunicationMethod("Звонок")} />
                    <p>Звонок</p>
                  </label>
                  <label htmlFor="wa">
                    <input type="radio" name="communications" id="wa" checked={communicationMethod === "WhatsApp"} onChange={() => setCommunicationMethod("WhatsApp")} />
                    <p>Whatsapp</p>
                  </label>
                  <label htmlFor="telegram">
                    <input type="radio" name="communications" id="telegram" checked={communicationMethod === "Telegram"} onChange={() => setCommunicationMethod("Telegram")} />
                    <p>Telegram</p>
                  </label>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className={s.approval}>
                <label htmlFor="approval-not-file">
                  <input
                    type="checkbox"
                    name="approval"
                    id="approval-not-file"
                    checked={isAccepted}
                    onChange={(event) => setIsAccepted(event.target.checked)}
                    required
                  />
                  <p>Нажимая на кнопку «Оставить заявку», подтверждаю своё согласие на обработку персональных данных и <a href="">Положение о политике конфиденциальности</a></p>
                </label>
              </div>
              <button className={s.buttonSend} disabled={isLoading}>
                {isLoading ? "Отправляем..." : "Оставить заявку"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
