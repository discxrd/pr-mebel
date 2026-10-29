"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import s from "./hero.module.css";
import r from "./responsive.module.css";
import { cn } from "@/lib/utils";
import { HeroCooperation } from "./cooperation";
import { DialogFormFile } from "../dialog-form-file";
import { titlesMebelUTM, utmKeys } from "@/variables";

// const listTitilesMebel = [
//   "Проверим проект <br /> на реализуемость",
//   "Согласуем <br /> технические решения <br /> с дизайнером",
//   "Предложим лучшее <br /> решение в рамках <br /> бюджета",
//   "Изготовим и <br /> смонтируем <br /> под ключ",
// ];



export const Hero = ({ type, image, imageMobile }: { type: string, image: string | StaticImageData, imageMobile?: string | StaticImageData }) => {
  const [activeOffer, setActiveOffer] = useState<typeof titlesMebelUTM[0] | null>(titlesMebelUTM[0]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      const params = new URLSearchParams(search);

      const containsUtm = utmKeys.some(key => params.has(key));
      
      let matched: typeof titlesMebelUTM[0] | undefined;

      if (containsUtm) {
        const utmMediumVal = params.get("utm_medium")?.toLowerCase();
        
        if (utmMediumVal) {
          matched = titlesMebelUTM.find(offer => offer.key.toLowerCase() === utmMediumVal);
        }
        
        if (matched) {
          sessionStorage.setItem("has-utm", "true");
          sessionStorage.setItem("utm-campaign-key", matched.key);
          setActiveOffer(matched);
        } else {
          sessionStorage.removeItem("has-utm");
          sessionStorage.removeItem("utm-campaign-key");
          setActiveOffer(titlesMebelUTM[0]);
        }
      } else {
        const storedUtm = sessionStorage.getItem("has-utm");
        if (storedUtm === "true") {
          const storedKey = sessionStorage.getItem("utm-campaign-key");
          matched = titlesMebelUTM.find(offer => offer.key === storedKey);
          if (matched) {
            setActiveOffer(matched);
          } else {
            setActiveOffer(titlesMebelUTM[0]);
          }
        } else {
          setActiveOffer(titlesMebelUTM[0]);
        }
      }
    }
  }, []);

  return (
    <section id="hero">
      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-desktop-bg { display: block; }
        .hero-mobile-bg { display: none; }
        @media (max-width: 1160px) {
          .hero-desktop-bg { display: none !important; }
          .hero-mobile-bg { display: block !important; }
        }
      ` }} />
      <div className={cn("relative z-10 w-full overflow-hidden", s.heroWrapper, r.heroWrapper, s.main, r.main)}>
        {/* Desktop background */}
        <div className="hero-desktop-bg absolute inset-0 w-full h-full z-[-1]">
          <Image
            src={image}
            alt=""
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
        </div>

        {/* Mobile background */}
        {imageMobile && (
          <div className="hero-mobile-bg absolute inset-x-0 top-[45px] h-[calc(100%-45px)] z-[-1]">
            <Image
              src={imageMobile}
              alt=""
              fill
              priority
              className="w-full h-full object-cover"
              sizes="100vw"
            />
          </div>
        )}

        {
          type === "cooperation" && (
            <HeroCooperation image={image} />
          )
        }
        {type === "main" && (
          <div className={cn(s.heroContainer, r.heroContainer)}>
            <div className={cn(s.container, r.container)}>
              <div className="empty"></div>

               {activeOffer && (
                <div className={cn(s.titleContainer, r.titleContainer)}>
                  <div className={cn(s.titleWrapper, r.titleWrapper)}>
                    <h1 dangerouslySetInnerHTML={{__html: activeOffer.title}}/>

                    <h3>{activeOffer.subtitle}</h3>
                    <DialogFormFile submitText={activeOffer.btnText} formName={`Первый экран главной (${activeOffer.key})`}>
                      <button className={cn(s.button, r.button)}>
                        {activeOffer.btnText}
                      </button>
                    </DialogFormFile>
                  </div>

                  <div className={cn(s.listTitle, r.listTitle)}>
                    {activeOffer.listTitles.map((item, index) => (
                      <h5 key={index} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
      {type === "main" && activeOffer && (
        <div className={cn(s.utmMobileCards, r.utmMobileCards)}>
          {activeOffer.listTitles.map((item, index) => (
            <div key={index} className={s.utmCard}>
              <div className={s.utmCardInner}>
                <span className={s.utmCardNumber}>{String(index + 1).padStart(2, '0')}</span>
                <p className={s.utmCardText} dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};