"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import s from "./formBottom.module.css";
import r from "./responsive.module.css";
import { cn } from "@/lib/utils";

import tgIcon from "@/../public/tg-yellow.svg";
import waIcon from "@/../public/wa-yellow.svg";
import linkSvg from "@/../public/link.svg"
import { sendToTelegram } from "@/server/full";
import { Link as LinkIcon, X } from "lucide-react";
import { formatPhone } from "@/lib/format-phone";
import bgForm3 from "@/../public/bg-contact-bottom-v2.webp";

export default function FormBottom() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [totalSizeMB, setTotalSizeMB] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const router = useRouter();

  useEffect(() => {
    const totalSizeBytes = files.reduce((sum, file) => sum + file.size, 0);
    setTotalSizeMB(totalSizeBytes / (1024 * 1024));
  }, [files]);

  useEffect(() => {
    const phoneDigits = formatPhone(phone).digits;
    if (!name.trim() || !phoneDigits) {
      setError("");
      return;
    }
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("7")) {
      setError("Неверный формат телефона");
      return;
    }
    if (!agreed) {
      setError("Необходимо согласиться с условиями");
      return;
    }
    if (totalSizeMB > 50) {
      setError("Максимально допустимо 50 МБ");
      return;
    }
    setError("");
  }, [name, phone, agreed, totalSizeMB]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(event.target.value).formatted);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneDigits = formatPhone(phone).digits;
    if (!name.trim() || !phoneDigits) {
      setError("Заполните, пожалуйста, все поля");
      return;
    }
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("7")) {
      setError("Неверный формат телефона");
      return;
    }
    if (!agreed) {
      setError("Необходимо согласиться с условиями");
      return;
    }
    if (totalSizeMB > 50) {
      setError("Максимально допустимо 50 МБ");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = {
      name: name.trim(),
      phone: phoneDigits,
      width: window.screen.width * window.devicePixelRatio,
      height: window.screen.height * window.devicePixelRatio,
      block: "Подвал сайта (Есть вопросы?)",
      question: question.trim(),
      files,
      honeypot,
    };

    try {
      const response = await sendToTelegram(formData);

      if (response.success) {
        setName("");
        setPhone("");
        setQuestion("");
        setFiles([]);
        router.push("/thanks");
      } else {
        setError(response.error || "Произошла ошибка при отправке формы");
      }
    } catch {
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={cn(s.formSection, r.formSection)}>
      <Image
        src={bgForm3}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className={cn(s.wrapper, r.wrapper)}>
        <h2 className={cn(s.heading, r.heading)}>
          Не знаете с чего начать, или у вас остались вопросы?
        </h2>
        <p className={cn(s.subheading, r.subheading)}>
          Напишите нам, и мы поможем во всем разобраться и воплотить вашу идею
        </p>

        <form onSubmit={handleSubmit} className={s.form}>
          <input
            type="text"
            name="username_confirm"
            style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
          {/* Первый ряд: Имя и Телефон */}
          <div className={cn(s.inputRow, r.inputRow)}>
            <input
              type="text"
              placeholder="Ваше имя"
              className={cn(s.input, r.input)}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Ваш номер телефона"
              className={cn(s.input, r.input)}
              value={phone}
              onChange={handlePhoneChange}
              required
            />
          </div>

          {/* Второй ряд: Вопрос */}
          <div className={cn(s.textareaRow, r.textareaRow)}>
            <textarea
              placeholder="Вопрос"
              className={cn(s.textarea, r.textarea)}
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></textarea>
          </div>

          {/* Третий ряд: Загрузка файла */}
          <div className={cn(s.fileRow, r.fileRow)}>
            <span className={cn(s.fileText, r.fileText)}>Приложите файл проекта:</span>
            <label htmlFor="file-upload-bottom" className={cn(s.fileUploadBtn, r.fileUploadBtn)}>
              <input
                id="file-upload-bottom"
                type="file"
                className={s.fileInputHidden}
                multiple
                onChange={handleFileChange}
              />
              <LinkIcon width={16} height={16} />
              ЗАГРУЗИТЬ ФАЙЛЫ
              {files.length > 0 && (
                <span className={cn(s.nameFile, r.nameFile)}>
                  {`${files.length} шт. · ${totalSizeMB.toFixed(2)} МБ`}
                  <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    setFiles([]);
                    const input = document.getElementById("file-upload-bottom") as HTMLInputElement;
                    if (input) input.value = "";
                  }}>
                    <X width={16} height={16} color="white"/>
                  </button>
                </span>
              )}
            </label>
          </div>

          <div className={cn(s.errorContainer, r.errorContainer, files.length > 0 && cn(s.errorContainerWithFile, r.errorContainerWithFile))}>
            <p className={cn(s.error, r.error)} style={{ visibility: error ? "visible" : "hidden" }}>
              {error || "\u00A0"}
            </p>
          </div>

          {/* Четвертый ряд: Согласие и Кнопка отправки */}
          <div className={cn(s.footerRow, r.footerRow)}>
            <label className={cn(s.checkboxWrapper, r.checkboxWrapper)}>
              <input
                type="checkbox"
                className={s.hiddenCheckbox}
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                required
              />
              <span className={cn(s.customCheckbox, r.customCheckbox)}>
                {agreed && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={cn(s.checkboxText, r.checkboxText)}>
                Нажимая на кнопку «Оставить заявку», подтверждаю своё согласие на обработку персональных данных и Положение о политике конфиденциальности
              </span>
            </label>

            <button type="submit" className={cn(s.submitBtn, r.submitBtn)} disabled={isLoading}>
              {isLoading ? "Отправляем..." : "ОСТАВИТЬ ЗАЯВКУ"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}