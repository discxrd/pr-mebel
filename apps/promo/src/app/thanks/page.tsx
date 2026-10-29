"use client";

import { useEffect } from "react";
import { YandexMetrikaId } from "@/scripts";
import { ContactsSection } from "@/sections/contacts";
import { Footer } from "@/sections/footer";
import { Header } from "@/sections/header";
import { HeroThanks } from "@/sections/hero-thanks";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);

      if (window.ym) {
        window.ym(YandexMetrikaId, "hit", "/thanks");
        window.ym(YandexMetrikaId, "reachGoal", "promo/pages/thanks");
      }
    }
  }, []);

  return (
    <>
      <Header />
      <HeroThanks />
      {/* <ContactsSection /> */}
      <Footer />
    </>
  );
}
