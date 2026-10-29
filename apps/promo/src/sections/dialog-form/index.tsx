"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  // Dialog,

  DialogDescription,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,

  DrawerTrigger,
} from "@/components/ui/drawer";
import * as Dialog from '@radix-ui/react-dialog';

import { useEffect, useState, FormEvent, MouseEvent } from "react";
import { sendToTelegram } from "@/server/full";
import { useRouter } from "next/navigation";
import { formatPhone } from "@/lib/format-phone";
import styles from "./dialog.module.css";

type DialogFormProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  submitText?: string;
  formName?: string;
};

export function DialogForm({ children, title, description, submitText, formName }: DialogFormProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isAccepted, setIsAccepted] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  // const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [totalSizeMB, setTotalSizeMB] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [communicationMethod, setCommunicationMethod] = useState("Звонок");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      setFile(newFiles[0]); // Store the first file for processing
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(event.target.value).formatted);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target;
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleBlur = () => {
    setTimeout(() => {
      window.scrollTo(0, window.scrollY);
    }, 100);
  };

  useEffect(() => {
    const totalSizeBytes = files.reduce((sum, file) => sum + file.size, 0);
    setTotalSizeMB(totalSizeBytes / (1024 * 1024));
  }, [files]);

  useEffect(() => {
    const phoneDigits = formatPhone(phone).digits;
    const trimmedName = name.trim();

    // 1. Проверка на пустые поля
    if (!phoneDigits || !trimmedName) {
      setError("");
      return;
    }

    // 2. Проверка формата телефона
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("7")) {
      setError("Неверный формат телефона");
      return;
    }

    // 3. Проверка чекбокса
    if (!isAccepted) {
      setError("Необходимо согласиться с условиями");
      return;
    }

    // 4. Если всё ок — убираем ошибку
    setError("");
  }, [phone, name, isAccepted]);

  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShakeTrigger((prev) => prev + 1);

    const phoneDigits = formatPhone(phone).digits;

    if (!phoneDigits || !name.trim()) {
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

    const formData = {
      phone: phoneDigits,
      name: name.trim(),
      width: window.screen.width * window.devicePixelRatio,
      height: window.screen.height * window.devicePixelRatio,
      isAccepted,
      block: `${formName || "Диалоговое окно"} (${files.length > 0 ? "Есть проект" : "Заказать звонок"})`,
      files,
      question: question.trim(),
      method: communicationMethod,
      honeypot,
    };

    try {
      const response = await sendToTelegram(formData);

      if (response.success) {
        setName("");
        setPhone("");
        setFiles([]);
        setOpen(false);
        router.push("/thanks");
      } else {
        setError(response.error || "Произошла ошибка при отправке формы");
      }
    } catch (error) {
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  if (isDesktop) {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {/* Элемент, по клику на который откроется модалка */}
        <Dialog.Trigger asChild>
          {children}
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />

          <Dialog.Content className={styles.content}>
            <Dialog.Close className={styles.closeButton} aria-label="Закрыть">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L15 15M15 1L1 15" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Dialog.Close>

            {/* Radix требует Title и Description для доступности (a11y) */}
            <Dialog.Title className={styles.title}>
              {title || "ПРИГЛАШАЕМ В НАШ ШОУРУМ НА ПЕРСОНАЛЬНУЮ КОНСУЛЬТАЦИЮ"}
            </Dialog.Title>
            <Dialog.Description className={styles.description}>
              {description || "Оставьте контактные данные — мы свяжемся с вами в ближайшее время, чтобы согласовать дату и время визита, а также забронируем парковочное место, если это необходимо."}
            </Dialog.Description>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username_confirm"
                style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
              <div className={styles.contactSection}>
                <span className={styles.contactLabel}>Предпочитаемый способ связи:</span>
                <div className={styles.communications}>
                  <label className={communicationMethod === "Звонок" ? styles.activeRadio : ""} htmlFor="dialog-comm-call">
                    <input
                      type="radio"
                      name="dialog-communications"
                      id="dialog-comm-call"
                      checked={communicationMethod === "Звонок"}
                      onChange={() => setCommunicationMethod("Звонок")}
                    />
                    <span className={communicationMethod === "Звонок" ? styles.activeRadio : ""}>ЗВОНОК</span>
                  </label>
                  <label htmlFor="dialog-comm-max" className={communicationMethod === "MAX" ? styles.activeRadio : ""}>
                    <input
                      type="radio"
                      name="dialog-communications"
                      id="dialog-comm-max"
                      checked={communicationMethod === "MAX"}
                      onChange={() => setCommunicationMethod("MAX")}
                    />
                    <span className={communicationMethod === "MAX" ? styles.activeRadio : ""}>MAX</span>
                  </label>
                  <label className={communicationMethod === "Telegram" ? styles.activeRadio : ""} htmlFor="dialog-comm-tg">
                    <input
                      type="radio"
                      name="dialog-communications"
                      id="dialog-comm-tg"
                      checked={communicationMethod === "Telegram"}
                      onChange={() => setCommunicationMethod("Telegram")}
                    />
                    <span className={communicationMethod === "Telegram" ? styles.activeRadio : ""}>TELEGRAM</span>
                  </label>
                </div>
              </div>

              <div className={styles.inputsRow}>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className={styles.inputField}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Ваш номер телефона"
                  className={styles.inputField}
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>

              <div className={styles.textareaRow}>
                <textarea
                  placeholder="Вопрос"
                  className={styles.textareaField}
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>



              <div className={styles.errorContainer}>
                {error && <p className={styles.error}>{error}</p>}
              </div>

              <div className={styles.footerRow}>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                  {isLoading ? "Отправляем..." : (submitText || "ПОСЕТИТЬ САЛОН")}
                </button>

                <div className={styles.agreementRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isAccepted}
                    onChange={(e) => setIsAccepted(e.target.checked)}
                    required
                  />
                  <p className={styles.agreementText}>
                    Нажимая на кнопку «Оставить заявку», подтверждаю своё согласие на обработку персональных данных и Положение о политике конфиденциальности
                  </p>
                </div>
              </div>
            </form>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-white max-h-[85dvh] flex flex-col">
        <div className="overflow-y-auto flex-1 px-5 pt-6 pb-8">
          <DialogHeader className="mb-6 space-y-3">
            <DialogTitle className="text-left font-normal text-2xl uppercase text-[#1f1e1a] tracking-normal leading-[1.2]">
              {title || "ПРИГЛАШАЕМ В НАШ ШОУРУМ НА ПЕРСОНАЛЬНУЮ КОНСУЛЬТАЦИЮ"}
            </DialogTitle>
            <DialogDescription className="text-left text-sm text-[#1f1e1a] leading-[1.3] font-normal">
              {description || "Оставьте контактные данные — мы свяжемся с вами в ближайшее время, чтобы согласовать дату и время визита, а также забронируем парковочное место, если это необходимо."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input type="hidden" name="formSource" value="dialog-form" />

            <div className={styles.inputsRow}>
              <input
                type="text"
                placeholder="Ваше имя"
                className={styles.inputField}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
              <input
                type="tel"
                placeholder="Ваш номер телефона"
                className={styles.inputField}
                value={phone}
                onChange={handlePhoneChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>

            <div className={styles.textareaRow}>
              <textarea
                placeholder="Вопрос"
                className={styles.textareaField}
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.contactSection}>
              <span className={styles.contactLabel}>Предпочитаемый способ связи:</span>
              <div className={styles.communications}>
                <label className={communicationMethod === "Звонок" ? styles.activeRadio : ""} htmlFor="drawer-comm-call">
                  <input
                    type="radio"
                    name="drawer-communications"
                    id="drawer-comm-call"
                    checked={communicationMethod === "Звонок"}
                    onChange={() => setCommunicationMethod("Звонок")}
                  />
                  <span className={communicationMethod === "Звонок" ? styles.activeRadio : ""}>ЗВОНОК</span>
                </label>
                <label htmlFor="drawer-comm-max" className={communicationMethod === "MAX" ? styles.activeRadio : ""}>
                  <input
                    type="radio"
                    name="drawer-communications"
                    id="drawer-comm-max"
                    checked={communicationMethod === "MAX"}
                    onChange={() => setCommunicationMethod("MAX")}
                  />
                  <span className={communicationMethod === "MAX" ? styles.activeRadio : ""}>MAX</span>
                </label>
                <label className={communicationMethod === "Telegram" ? styles.activeRadio : ""} htmlFor="drawer-comm-tg">
                  <input
                    type="radio"
                    name="drawer-communications"
                    id="drawer-comm-tg"
                    checked={communicationMethod === "Telegram"}
                    onChange={() => setCommunicationMethod("Telegram")}
                  />
                  <span className={communicationMethod === "Telegram" ? styles.activeRadio : ""}>TELEGRAM</span>
                </label>
              </div>
            </div>

            {error && (
              <div className={styles.errorContainer} style={{ height: 'auto', marginBottom: '10px' }}>
                <p className={`${styles.error} ${styles.animateShake}`} style={{ position: 'static' }}>
                  {error}
                </p>
              </div>
            )}

            <div className={styles.footerRow}>
              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? "Отправляем..." : (submitText || "ПОСЕТИТЬ САЛОН")}
              </button>

              <div className={styles.agreementRow}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isAccepted}
                  onChange={(e) => setIsAccepted(e.target.checked)}
                  required
                />
                <p className={styles.agreementText}>
                  Нажимая на кнопку «Оставить заявку», подтверждаю своё согласие на обработку персональных данных и Положение о политике конфиденциальности
                </p>
              </div>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
