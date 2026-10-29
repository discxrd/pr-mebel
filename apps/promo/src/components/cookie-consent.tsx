"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import cookieLogo from "@/../public/cookie-logo.svg";
import s from "./styles/cookie.module.css"
export const CookieConsent = () => {
  const [loaded, setLoaded] = useState(false);
  const [isAccepted, setIsAccepted] = useState<boolean>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookie-consent");
    const accepted = !!cookieConsent;
    setIsAccepted(accepted);
    setLoaded(true);

    if (!accepted) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setIsAccepted(true);
    localStorage.setItem("cookie-consent", "accepted");
  };

  if (!loaded || isAccepted) return null;

  return (
    <>
      <div
        className={cn(
          s.wrapper,
          {
            [s.show]: isVisible,
          },
        )}
      >
        <div className={s.container}>
          <button className={s.closeButton} onClick={handleAccept} aria-label="Закрыть">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L11 11M11 1L1 11" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          
          <div className={s.topRow}>
            <Image src={cookieLogo} alt="cookie" width={46} height={46} className={s.logo} />
            <p className={s.text}>
              Пользуясь сайтом, вы соглашаетесь с использованием cookies и{" "}
              <a
                href="https://docs.google.com/document/d/1KSM18JIPpeT6weSQaG3dgpTEC9MO3wvxYWsrF2A6CZE"
                className="cursor-pointer underline"
              >
                политикой обработки персональных данных
              </a>
              .
            </p>
          </div>

          <button
            className={s.button}
            onClick={handleAccept}>
            Принять
          </button>
        </div>
      </div>
    </>
  );
};
