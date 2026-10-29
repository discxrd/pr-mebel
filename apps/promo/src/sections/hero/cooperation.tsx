"use client";

import { useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { DialogForm } from "../dialog-form";
import s from "./hero.module.css";
import r from "./responsive.module.css";
import { cn } from "@/lib/utils";
import { DialogFormFile } from "../dialog-form-file";

export const HeroCooperation = ({ image }: { image: string | StaticImageData }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("visited_cooperation_page", "true");
    }
  }, []);
  return (
    <div className=" h-full">
      <div className={cn(s.coopContainer, r.coopContainer)}>
        {/* Breadcrumbs */}


        {/* Bottom content row */}
        <div className={cn(s.coopBottomRow, r.coopBottomRow)}>
          {/* Left Side: Title */}
          <div className={cn(s.titleWrapperCooperation, r.titleWrapperCooperation)}>
            <h1>
              ПРИГЛАШАЕМ <br className="hidden md:inline" /> К СОТРУДНИЧЕСТВУ ДИЗАЙНЕРОВ
            </h1>
          </div>

          {/* Right Side: CTA box */}
          <div className={cn(s.btnCooperationWrapper, r.btnCooperationWrapper)}>
            <h5>
              Уточните условия <br /> сотрудничества <br /> с нами
            </h5>
            <DialogFormFile submitText="Обсудить проект" formName="Первый экран сотрудничества">
              <button className={cn(s.button, r.button)}>
                ОБСУДИТЬ ПРОЕКТ
              </button>
            </DialogFormFile>
          </div>
        </div>
      </div>
    </div>
  );
};