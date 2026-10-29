"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { useMetrika } from "@/hooks/use-metrika";
import Image from "next/image";
import Link from "next/link";
import s from "./style.module.css";
import image_hero_l from "@/../public/thanks/bg.webp";
import image_mobile from "@/../public/thanks/bg-mini.webp";

export const HeroThanks = () => {

  return (
    <section className={s.section}>
      {/* Desktop Layout (>= 1024px) */}
      <div className={s.desktopLayout}>
        {/* Background Image */}
        <div className={s.desktopBgContainer}>
          <Image
            src={image_hero_l}
            alt="Hero background (desktop)"
            fill
            priority
            sizes="100vw"
            className={s.desktopBgImage}
            placeholder="blur"
          />
        </div>

        {/* Card Overlay Container */}
        <div className={s.desktopCard}>
          <h1 className={s.desktopTitle}>
            Спасибо за обращение!
          </h1>
          <p className={s.desktopText}>
            Мы уже получили вашу заявку и в ближайшее время свяжемся с вами, чтобы
            предложить наилучшее решение для вашего проекта.
          </p>
          <Link href="/" className={s.desktopButtonLink}>
            <span>
              Вернуться на главную
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile & Tablet Layout (< 1024px) */}
      <div className={s.mobileLayout}>
        {/* Card on top */}
        <div className={s.mobileCard}>
          <h1 className={s.mobileTitle}>
            Спасибо за обращение <br /> в{" "}
            <span className={s.mobileTitleAccent}>"Nobiele Design"</span>
          </h1>
          <p className={s.mobileText}>
            Специалист свяжется в течение рабочего дня и поможет подобрать
            идеальную мебель для вашего проекта
          </p>
          <Link href="/" className={s.mobileButtonLink}>
            <span >
              Вернуться на главную
            </span>
          </Link>
        </div>

        {/* Background Image below */}
        <div className={s.mobileImageContainer}>
          <Image
            src={image_mobile}
            alt="Hero background (mobile)"
            className="w-full h-auto block"
            priority
            placeholder="blur"
          />
        </div>
      </div>
    </section>
  );
};
