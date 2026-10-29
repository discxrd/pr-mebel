import { YandexMetrikaId } from "@/scripts";
import { number } from "@/variables";
import Link from "next/link";
import React from "react";
import { DialogLinks } from "../dialog-links";
import Image from "next/image";

import whatsapp from "../../../public/wa-color.svg"
import telegram from "../../../public/tg-color.svg"
import max from "../../../public/max-color.svg"
import marker from "../../../public/marker-white.svg"
import logo_metro from "../../../public/logo_metro.svg";
import s from "./style.module.css";
import r from "./responsive.module.css";
import { cn } from "@/lib/utils";
import { DialogForm } from "../dialog-form";
import logo from "../../../public/Nobiele_logo.png"
import { DialogFormFile } from "../dialog-form-file";

interface DesktopProps {
  navItems: any[];
  WhatsAppLogo: React.ComponentType<any>;

}

export default function Desktop({ navItems, WhatsAppLogo }: DesktopProps) {
  return (
    <>
      <div className={cn(s.headerContainer, r.headerContainer)}>

        <div className={cn(s.leftSection, r.leftSection)}>
          <div className={cn(s.logoNavWrapper, r.logoNavWrapper)}>
            <div className={cn(s.logoWrapper, r.logoWrapper)}>
              <Link
                href="/"
                className={s.logoLink}
                onClick={(e) => {
                  if (typeof window !== "undefined" && window.location.pathname === "/") {
                    e.preventDefault();
                    const lenis = (window as any).lenis;
                    if (lenis) {
                      lenis.scrollTo(0, { duration: 1.2 });
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }
                }}
              >
                <Image src={logo} alt="logo" width={75} height={75} />
                <span>
                  Персональные <br />
                  мебельные решения
                </span>
              </Link>
            </div>
            <ul className={cn(s.navList, r.navList)}>
              {navItems.map((item: any, index: number) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
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
                    <p className={cn(s.linkTitle, r.linkTitle)}>
                      {item.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="w:[1px] bg-[#E7E7E7]" /> */}
        </div>

        <div className={cn(s.rightSection, r.rightSection)}>
          <Link
            href={`tel:${number.phone}`}
            className={cn(s.number, r.number)}
          >
            <p>{number.phoneMask}</p>
          </Link>
          <div className={cn(s.socialWrapper, r.socialWrapper)}>
            <Link
              href={"https://t.me/chastniy_mebelier"}
              onClick={() => {
                if (typeof window !== "undefined" && window.ym) {
                  window.ym(
                    YandexMetrikaId,
                    "reachGoal",
                    `promo/link/telegram`,
                  );
                }
              }}>
              <Image
                src={telegram}
                alt="telegram"
                width={30}
                height={30}
              />
            </Link>
            <Link
              href={"https://wa.me/79031119466"}
              onClick={() => {
                if (typeof window !== "undefined" && window.ym) {
                  window.ym(
                    YandexMetrikaId,
                    "reachGoal",
                    `promo/link/whatsapp`,
                  );
                }
              }}>
              <Image
                src={whatsapp}
                alt="whatsapp"
                width={30}
                height={30}
              />

            </Link>
            <Link
              href={"https://max.ru/u/f9LHodD0cOLsEIpAKED0TGn_IUduLG6ceDdyO0f-G34dHwLnPeVS0L5gaIc"}
              onClick={() => {
                if (typeof window !== "undefined" && window.ym) {
                  window.ym(
                    YandexMetrikaId,
                    "reachGoal",
                    `promo/link/max`,
                  );
                }
              }}>
              <Image
                src={max}
                alt="max"
                width={30}
                height={30}
              />
            </Link>

          </div>
          <DialogFormFile formName="Кнопка в шапке сайта (Десктоп)">
            <button className={cn(s.btnHeader, r.btnHeader)}>
              Оставить заявку
            </button>
          </DialogFormFile>

        </div>
      </div>
    </>

  );
}