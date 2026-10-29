"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DialogForm } from "../dialog-form";
import s from "./style.module.css";
import r from "./responsive.module.css";
import { number } from "@/variables";

import NobieleLogo from "../../../public/Nobiele_logo.png";
import waIcon from "@/../public/wa-color.svg";
import tgIcon from "@/../public/tg-color.svg";
import maxIcon from "@/../public/max-color.svg";
import { DialogFormFile } from "../dialog-form-file";
import { YandexMetrikaId } from "@/scripts";

export default function Mobile({ navItems, scrollDirection }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogoClick = (e: React.MouseEvent) => {
    setIsMenuOpen(false);
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className={s.mobileWrapper}>
      {isMenuOpen && (
        <div
          className={s.drawerOverlay}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <div className={cn(s.headerContentWrapper, scrollDirection === 'down' && s.headerContentWrapperScrolled)}>
        {/* 2. MAIN HEADER BAR (Logo, phone, and menu toggle) - White background */}
        <div className={cn(s.mainHeader, r.mainHeader)}>
          <Link href="/" onClick={handleLogoClick} className={s.logoLinkMobile}>
            <Image
              src={NobieleLogo}
              alt="logo"
              width={55}
              height={55}
              className={s.logoImgMobile}
              priority
            />
            <span className={s.logoTextMobile}>
              Персональные <br />
              мебельные решения
            </span>
          </Link>
          <div className={s.mainHeaderRight}>
            <a href={`tel:${number.phone}`} className={s.phoneLink}>
              {number.phoneMask}
            </a>
            <button
              onClick={() => setIsMenuOpen(true)}
              className={s.hamburgerBtn}
              aria-label="Открыть меню"
            >
              <span className={s.hamburgerLine} />
              <span className={s.hamburgerLine} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE FULLSCREEN MENU (Open state drawer) */}
      <div
        className={cn(
          s.drawer,
          isMenuOpen ? s.drawerOpen : s.drawerClosed
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Row inside open menu */}
        <div className={s.drawerHeader}>
          <Link href="/" onClick={handleLogoClick} className={s.logoLinkMobile}>
            <Image
              src={NobieleLogo}
              alt="logo"
              width={55}
              height={55}
              className={s.logoImgMobile}
            />
            <span className={s.logoTextMobile}>
              Персональные <br />
              мебельные решения
            </span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className={s.closeBtn}
            aria-label="Закрыть меню"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#1F1E1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className={s.drawerContent}>
          {/* Navigation Links */}
          <nav className={s.drawerNav}>
            {navItems.map((item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className={s.drawerLink}
                onClick={(e) => {
                  setIsMenuOpen(false);
                  if (typeof window !== "undefined") {
                    if (window.ym) {
                      window.ym(
                        YandexMetrikaId,
                        "reachGoal",
                        `promo/menu${item.href}`,
                      );
                    }
                    localStorage.setItem(`promo/menu${item.href}`, "true");
                  }
                  if (
                    typeof window !== "undefined" &&
                    window.location.pathname === "/" &&
                    item.href.startsWith("/#")
                  ) {
                    const targetId = item.href.split("#")[1];
                    const element = document.getElementById(targetId);
                    if (element) {
                      e.preventDefault();
                      const lenis = (window as any).lenis;
                      if (lenis) {
                        lenis.scrollTo(element, {
                          offset: -96,
                          duration: 1.2,
                        });
                      } else {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                      window.history.pushState(null, "", item.href);
                    }
                  }
                }}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Dark Bottom Section */}
          <div className={s.drawerBottomSection}>
            <div className={s.drawerContactsInfo}>
              <p className={s.drawerText}>г. Москва</p>
              <p className={s.drawerText}>Единая справочная служба</p>
              <a href={`tel:${number.phone}`} className={s.phoneLinkWhite}>
                {number.phoneMask}
              </a>
              <a href="mailto:info@nobiele.ru" className={s.emailLinkWhite}>
                info@nobiele.ru
              </a>
            </div>

            <div className={s.drawerSocials}>
              <Link
                href="https://t.me/chastniy_mebelier"
                className={s.socialIconLink}
                onClick={() => {
                  if (typeof window !== "undefined" && window.ym) {
                    window.ym(
                      YandexMetrikaId,
                      "reachGoal",
                      "promo/link/telegram",
                    );
                  }
                }}
              >
                <Image src={tgIcon} alt="Telegram" width={44} height={44} />
              </Link>
              <Link
                href="https://wa.me/79031119466"
                className={s.socialIconLink}
                onClick={() => {
                  if (typeof window !== "undefined" && window.ym) {
                    window.ym(
                      YandexMetrikaId,
                      "reachGoal",
                      "promo/link/whatsapp",
                    );
                  }
                }}
              >
                <Image src={waIcon} alt="WhatsApp" width={44} height={44} />
              </Link>
              <Link
                href="https://max.ru/u/f9LHodD0cOLsEIpAKED0TGn_IUduLG6ceDdyO0f-G34dHwLnPeVS0L5gaIc"
                className={s.socialIconLink}
                onClick={() => {
                  if (typeof window !== "undefined" && window.ym) {
                    window.ym(
                      YandexMetrikaId,
                      "reachGoal",
                      "promo/link/max",
                    );
                  }
                }}
              >
                <Image src={maxIcon} alt="Max" width={44} height={44} />
              </Link>
            </div>

            <DialogFormFile formName="Кнопка в шапке сайта (Мобильная)">
              <button className={s.submitBtnMobile}>
                Оставить заявку
              </button>
            </DialogFormFile>
          </div>
        </div>
      </div>
    </div>
  );
}
