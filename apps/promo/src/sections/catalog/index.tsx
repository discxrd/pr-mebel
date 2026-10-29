import React from "react";
import { DialogForm } from "../dialog-form";
import { Card } from "./card";
import s from "./catalog.module.css";
import r from "./responsive.module.css";
import { getCards } from "./cards";
import { AnimatedTitle } from "@/components/animated-title";
import { cn } from "@/lib/utils";

export default async function Catalog() {
  const cards = await getCards();

  return (
    <section id="catalog" className={cn(s.catalogSection, r.catalogSection, "scroll-mt-24")}>
      <div className={cn(s.catalogSectionWrapper, r.catalogSectionWrapper)}>
        <AnimatedTitle as="h3" className={cn(s.title, r.title)}>Наш каталог</AnimatedTitle>

        <div className={cn(s.cardProjectList, r.cardProjectList)}>
          {cards.map((card, index) => (
            <Card key={index} index={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
