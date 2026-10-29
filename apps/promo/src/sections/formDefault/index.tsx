"use client";

import React, { FormEvent, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import Image, { getImageProps, StaticImageData } from "next/image";

import { sendToTelegram } from "@/server/full";
import { uploadFilesToR2 } from "@/server/upload-files";
import s from "./formDefault.module.css";
import r from "./responsive.module.css";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, X } from "lucide-react";
import { formatPhone } from "@/lib/format-phone";

export default function FormWithFile({
  title,
  type,
  file = true,
  subtitle,
  bgImage,
  bgImageMobile,
  btnText,
  id,
}: {
  title: string;
  type: string;
  file?: boolean;
  subtitle?: string;
  bgImage?: string | StaticImageData;
  bgImageMobile?: string | StaticImageData;
  btnText?: string;
  id?: string;
}) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [communicationMethod, setCommunicationMethod] = useState("Звонок");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [totalSizeMB, setTotalSizeMB] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const formId = useId();
  const nameId = `${formId}-name`;
  const phoneId = `${formId}-phone`;
  const fileId = `${formId}-file`;
  const callId = `${formId}-call`;
  const maxId = `${formId}-max`;
  const telegramId = `${formId}-telegram`;
  const approvalId = `${formId}-approval`;
  const communicationsName = `${formId}-communications`;

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

    if (!isAccepted) {
      setError("Необходимо согласиться с условиями");
      return;
    }

    if (file && totalSizeMB > 50) {
      setError("Максимально допустимо 50 МБ");
      return;
    }

    setError("");
  }, [file, files.length, isAccepted, name, phone, totalSizeMB]);

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

    if (file && totalSizeMB > 50) {
      setError("Максимально допустимо 50 МБ");
      return;
    }

    setIsLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      const response = await sendToTelegram({
        phone: phoneDigits,
        name: name.trim(),
        width: window.screen.width * window.devicePixelRatio,
        height: window.screen.height * window.devicePixelRatio,
        files: file ? files : [],
        uploadUrl: null,
        block: title || (file ? "Форма с файлом" : "Форма без файла"),
        method: communicationMethod,
        honeypot,
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles(nextFiles);
    setUploadProgress(0);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(event.target.value).formatted);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <section
      id={id || (type === "main" ? "estimate" : undefined)}
      className={cn(s.formSection, r.formSection, (type === "main" || id) && "scroll-mt-24")}
    >
      <div className={cn(s.container, r.container)}>
        <div className={cn(s.content, r.content)}>
          <div className={cn(s.info, r.info)}>
            <div className={cn(s.heading, r.heading, !file && s.headingNoFile, !file && r.headingNoFile)}>
              <h2 dangerouslySetInnerHTML={{ __html: title }} />
              <p>{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className={cn(s.form, r.form)}>
              <input
                type="text"
                name="username_confirm"
                style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
              <div className={cn(s.nameSection, r.nameSection, !file && s.nameSectionNoFile, !file && r.nameSectionNoFile)}>
                <label htmlFor={nameId}>
                  <input
                    id={nameId}
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                </label>
                <label htmlFor={phoneId}>
                  <input
                    id={phoneId}
                    type="text"
                    placeholder="Ваш номер телефона"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </label>
              </div>

              <div className={cn(s.middleRow, r.middleRow, !file && s.middleRowNoFile, !file && r.middleRowNoFile)}>
                {file && (
                  <div className={cn(s.fileSection, r.fileSection)}>
                    <h4>Приложите файл проекта:</h4>
                    <div className={cn(s.fileSectionWrapper, r.fileSectionWrapper)}>
                      <label htmlFor={fileId}>
                        <span className={cn(s.clipIcon, r.clipIcon)} aria-hidden="true">
                          <LinkIcon width={16} height={16} />
                        </span>
                        <span>Загрузить файлы проекта</span>
                        <input id={fileId} type="file" onChange={handleFileChange} multiple />
                      </label>
                      <span className={cn(s.nameFile, r.nameFile)} style={{ visibility: files.length > 0 ? "visible" : "hidden" }}>
                        {files.length > 0 ? `${files.length} шт. · ${totalSizeMB.toFixed(2)} МБ` : "\u00A0"}
                        <button type="button" onClick={() => {
                          setFiles([]);
                          const input = document.getElementById(fileId) as HTMLInputElement;
                          if (input) input.value = "";
                        }}>
                          <X width={16} height={16} />
                        </button>
                      </span>
                    </div>
                    {isLoading && uploadProgress > 0 && (
                      <p className={cn(s.uploadProgress, r.uploadProgress)}>Загрузка файлов: {uploadProgress}%</p>
                    )}
                  </div>
                )}

                <div className={cn(s.communicationsSection, r.communicationsSection, !file && s.communicationsSectionNoFile, !file && r.communicationsSectionNoFile)}>
                  <h4>Предпочитаемый способ связи:</h4>
                  <div className={cn(s.communications, r.communications)} style={!file ? { paddingRight: "93px" } : {}}>
                    <label className={communicationMethod === "Звонок" ? s.active : ""} htmlFor={callId}>
                      <input
                        type="radio"
                        name={communicationsName}
                        id={callId}
                        checked={communicationMethod === "Звонок"}
                        onChange={() => setCommunicationMethod("Звонок")}
                      />
                      <span className={communicationMethod === "Звонок" ? s.active : ""}>Звонок</span>
                    </label>
                    <label htmlFor={maxId} className={communicationMethod === "MAX" ? s.active : ""}>
                      <input
                        type="radio"
                        name={communicationsName}
                        id={maxId}
                        checked={communicationMethod === "MAX"}
                        onChange={() => setCommunicationMethod("MAX")}
                      />
                      <span className={communicationMethod === "MAX" ? s.active : ""}>MAX</span>
                    </label>
                    <label className={communicationMethod === "Telegram" ? s.active : ""} htmlFor={telegramId}>
                      <input
                        type="radio"
                        name={communicationsName}
                        id={telegramId}
                        checked={communicationMethod === "Telegram"}
                        onChange={() => setCommunicationMethod("Telegram")}
                      />
                      <span className={communicationMethod === "Telegram" ? s.active : ""}>Telegram</span>
                    </label>
                  </div>
                </div>
              </div>

              <p className={cn(s.error, r.error)} style={{ visibility: error ? "visible" : "hidden" }}>
                {error || "\u00A0"}
              </p>

              <div className={cn(s.bottomRow, r.bottomRow)}>
                <button className={cn(s.buttonSend, r.buttonSend)} disabled={isLoading}>
                  {isLoading ? "Отправляем..." : btnText}
                </button>

                <div className={cn(s.approval, r.approval)}>
                  <label htmlFor={approvalId}>
                    <input
                      type="checkbox"
                      name="approval"
                      id={approvalId}
                      className={s.hiddenCheckbox}
                      checked={isAccepted}
                      onChange={(event) => setIsAccepted(event.target.checked)}
                      required
                    />
                    <span className={cn(s.customCheckbox, r.customCheckbox)}>
                      {isAccepted && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>
                      Нажимая на кнопку «Оставить заявку», подтверждаю свое согласие на обработку персональных данных и{" "}
                      <a href="">Положение о политике конфиденциальности</a>
                    </span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {bgImage ? (
          <div className={cn(s.bg, r.bg)} aria-hidden="true">
            {(() => {
              const common = { alt: "", fill: true, sizes: "(max-width: 1024px) 100vw, 50vw" };
              const { props: { srcSet: desktopSrcSet, ...desktopProps } } = getImageProps({
                ...common,
                src: bgImage,
              });
              const { props: { srcSet: mobileSrcSet } } = bgImageMobile
                ? getImageProps({ ...common, src: bgImageMobile })
                : { props: { srcSet: undefined } };

              return (
                <picture className="absolute inset-0 w-full h-full">
                  {bgImageMobile && <source media="(max-width: 768px)" srcSet={mobileSrcSet} />}
                  {bgImageMobile && <source media="(min-width: 769px)" srcSet={desktopSrcSet} />}
                  <img
                    {...desktopProps}
                    alt=""
                    className={cn(s.bgImage, r.bgImage, "w-full h-full object-cover")}
                  />
                </picture>
              );
            })()}
          </div>
        ) : (
          <div className={cn(s.bg, r.bg)} aria-hidden="true" />
        )}
      </div>
    </section>
  );
}
