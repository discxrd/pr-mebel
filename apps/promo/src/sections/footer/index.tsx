"use client";

import Image from "next/image";
import { ComponentProps } from "react";
import s from "./footer.module.css";
import r from "./responsive.module.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { YandexMetrikaId } from "@/scripts";
import { number } from "@/variables";

import logoIcon from "@/../public/Nobiele_foooter.png";
import waLogo from "@/../public/wa-white.svg";
import telegramLogo from "@/../public/tg-white.svg";
import maxLogo from "@/../public/max-white.svg";
import { DialogForm } from "../dialog-form";
import { DialogFormFile } from "../dialog-form-file";

export const Footer = () => {
  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/" &&
      href.startsWith("/#")
    ) {
      const targetId = href.split("#")[1];
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
        window.history.pushState(null, "", href);
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent, category: string) => {
    if (typeof window !== "undefined" && window.ym) {
      const catalogGoals: Record<string, string> = {
        "КУХНИ": "promo/catalog/1",
        "ГАРДЕРОБНЫЕ": "promo/catalog/2",
        "ШКАФЫ": "promo/catalog/3",
        "ГОСТИНЫЕ": "promo/catalog/4",
        "ДЕТСКИЕ": "promo/catalog/5",
        "МЕБЕЛЬ ДЛЯ ВАННЫ": "promo/catalog/6",
      };
      const goal = catalogGoals[category];
      if (goal) {
        window.ym(YandexMetrikaId, "reachGoal", goal);
      }
    }

    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("open-catalog-card", { detail: category }));
    }
  };

  return (
    <footer className={cn(s.footer, r.footer)}>
      <div className={cn(s.footerWrapper, r.footerWrapper)}>
        <div className={cn(s.col, s.colFirst, r.col, r.colFirst)}>
          <div className={cn(s.lineB, s.lineBFirst, r.lineB, r.lineBFirst)}></div>
          <div className={cn(s.logoBlock, r.logoBlock)}>
            <div className={cn(s.footerLogoLink, r.footerLogoLink)}>
              <Image
                src={logoIcon}
                alt="logo"
                width={78}
                height={78}
              />
              <span className={cn(s.footerLogoText, r.footerLogoText)}>
                Персональные <br />
                мебельные решения
              </span>
            </div>
          </div>
          <div className={cn(s.linksPolicy, r.linksPolicy)}>
            <Link href={"/"}>Согласие на использование cookie</Link>
            <Link href={"https://docs.google.com/document/d/1KSM18JIPpeT6weSQaG3dgpTEC9MO3wvxYWsrF2A6CZE/edit?tab=t.0"}>Политика конфиденциальности</Link>
            <p className={cn(s.copyrightDesktop, r.copyrightDesktop)}>© Nobiele Design  2000-2026</p>
            <p className={cn(s.copyrightMobile, r.copyrightMobile)}>© Nobiele Design  2000-2026</p>
          </div>
        </div>
        <div className={cn(s.col, r.col)}>
          <div className={cn(s.lineL, r.lineL)}></div>
          {/* <div className={s.lineR}></div> */}
          <div className={cn(s.lineB, s.lineBSecond, r.lineB, r.lineBSecond)}></div>
          <div className={cn(s.colsLinkWrapper, r.colsLinkWrapper)}>
            <div className={cn(s.colLinkWrapper, r.colLinkWrapper)}>
              <h5>Каталог</h5>
              <div className={cn(s.listNav, r.listNav)}>
                <Link href={"/#catalog?open=КУХНИ"} onClick={(e) => handleLinkClick(e, "КУХНИ")}>КУХНИ</Link>
                <Link href={"/#catalog?open=ГАРДЕРОБНЫЕ"} onClick={(e) => handleLinkClick(e, "ГАРДЕРОБНЫЕ")}>ГАРДЕРОБНЫЕ</Link>
                <Link href={"/#catalog?open=ШКАФЫ"} onClick={(e) => handleLinkClick(e, "ШКАФЫ")}>ШКАФЫ</Link>
                <Link href={"/#catalog?open=ГОСТИНЫЕ"} onClick={(e) => handleLinkClick(e, "ГОСТИНЫЕ")}>ГОСТИНЫЕ</Link>
                <Link href={"/#catalog?open=ДЕТСКИЕ"} onClick={(e) => handleLinkClick(e, "ДЕТСКИЕ")}>ДЕТСКИЕ</Link>
                <Link href={"/#catalog?open=МЕБЕЛЬ ДЛЯ ВАННЫ"} onClick={(e) => handleLinkClick(e, "МЕБЕЛЬ ДЛЯ ВАННЫ")}>МЕБЕЛЬ ДЛЯ ВАННЫ</Link>
              </div>
            </div>
            <div className={cn(s.colLinkWrapper, r.colLinkWrapper)}>
              <h5>Клиентам</h5>
              <div className={cn(s.listNav, r.listNav)}>
                <Link
                  href={"/#projects"}
                  onClick={(e) => {
                    if (typeof window !== "undefined") {
                      if (window.ym) {
                        window.ym(YandexMetrikaId, "reachGoal", "promo/menu/#projects");
                      }
                      localStorage.setItem("promo/menu/#projects", "true");
                    }
                    handleAnchorClick(e, "/#projects");
                  }}
                >
                  ПРОЕКТЫ
                </Link>
                <Link
                  href={"/#advantages"}
                  onClick={(e) => {
                    if (typeof window !== "undefined") {
                      if (window.ym) {
                        window.ym(YandexMetrikaId, "reachGoal", "promo/menu/#advantages");
                      }
                      localStorage.setItem("promo/menu/#advantages", "true");
                    }
                    handleAnchorClick(e, "/#advantages");
                  }}
                >
                  ПРЕИМУЩЕСТВА
                </Link>
                <Link
                  href={"/cooperation"}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      if (window.ym) {
                        window.ym(YandexMetrikaId, "reachGoal", "promo/menu/cooperation");
                      }
                      localStorage.setItem("promo/menu/cooperation", "true");
                    }
                  }}
                >
                  ДИЗАЙНЕРАМ
                </Link>
                <Link
                  href={"/#productions"}
                  onClick={(e) => {
                    if (typeof window !== "undefined") {
                      if (window.ym) {
                        window.ym(YandexMetrikaId, "reachGoal", "promo/menu/#productions");
                      }
                      localStorage.setItem("promo/menu/#productions", "true");
                    }
                    handleAnchorClick(e, "/#productions");
                  }}
                >
                  ПРОИЗВОДСТВО
                </Link>
                <Link
                  href={"/#reviews"}
                  onClick={(e) => {
                    if (typeof window !== "undefined") {
                      if (window.ym) {
                        window.ym(YandexMetrikaId, "reachGoal", "promo/menu/#reviews");
                      }
                      localStorage.setItem("promo/menu/#reviews", "true");
                    }
                    handleAnchorClick(e, "/#reviews");
                  }}
                >
                  ОТЗЫВЫ
                </Link>
                <Link
                  href={"/#contacts"}
                  onClick={(e) => {
                    if (typeof window !== "undefined") {
                      if (window.ym) {
                        window.ym(YandexMetrikaId, "reachGoal", "promo/menu/#contacts");
                      }
                      localStorage.setItem("promo/menu/#contacts", "true");
                    }
                    handleAnchorClick(e, "/#contacts");
                  }}
                >
                  КОНТАКТЫ
                </Link>
              </div>
            </div>
          </div>

        </div>

        <div className={cn(s.col, s.colThird, r.col, r.colThird)}>
          <div className={cn(s.lineL, s.lineLThird, r.lineL, r.lineLThird)}></div>
          <div className={cn(s.lineB, s.lineBThird, r.lineB, r.lineBThird)}></div>

          <div className={cn(s.contactsCol, r.contactsCol)}>
            <h5>Контакты</h5>
            <div className={cn(s.listContacts, r.listContacts)}>
              <p className={s.address}>
                г. Москва
              </p>
              <p className={s.address}>
                Единая справочная служба
              </p>
              <Link href={`tel:${number.phone}`} className={s.number}>{number.phoneMask}</Link>
              <Link href={"mailto:info@nobiele.ru"} className={s.address}>info@nobiele.ru</Link>
            </div>
          </div>

          <div className={cn(s.socialsCol, r.socialsCol)}>
            <h5>Связаться с нами</h5>
            <div className={cn(s.listSocial, r.listSocial)}>
              <Link
                href={"https://t.me/chastniy_mebelier"}
                onClick={() => {
                  if (typeof window !== "undefined" && window.ym) {
                    window.ym(YandexMetrikaId, "reachGoal", "promo/link/telegram");
                  }
                }}
              >
                <Image
                  src={telegramLogo}
                  alt="telegram"
                  width={34}
                  height={34}
                />
              </Link>
              <Link
                href={"https://wa.me/79031119466"}
                onClick={() => {
                  if (typeof window !== "undefined" && window.ym) {
                    window.ym(YandexMetrikaId, "reachGoal", "promo/link/whatsapp");
                  }
                }}
              >
                <Image
                  src={waLogo}
                  alt="whatsapp"
                  width={34}
                  height={34}
                />
              </Link>
              <Link
                href={"https://max.ru/u/f9LHodD0cOLsEIpAKED0TGn_IUduLG6ceDdyO0f-G34dHwLnPeVS0L5gaIc"}
                onClick={() => {
                  if (typeof window !== "undefined" && window.ym) {
                    window.ym(YandexMetrikaId, "reachGoal", "promo/link/max");
                  }
                }}
              >
                <Image
                  src={maxLogo}
                  alt="phone"
                  width={34}
                  height={34}
                />
              </Link>
              <DialogFormFile formName="Кнопка в подвале (ПЕРЕЗВОНИТЕ МНЕ)">
                <button className={cn(s.btnCallMe, r.btnCallMe)}>ПЕРЕЗВОНИТЕ МНЕ</button>
              </DialogFormFile>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
