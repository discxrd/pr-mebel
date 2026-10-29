import { YandexMetrikaId } from "@/scripts";
import { number } from "@/variables";
import Link from "next/link";
import React from "react";
import { DialogLinks } from "../../dialog-links";

export default function Desktop({ Logo, navItems, WhatsAppLogo }: any) {
  return (
    <div className="container hidden h-full justify-between text-xs xl:flex">
      <div className="flex space-x-4">
        <div className="relative h-full w-[100px] md:w-[175px]">
          <Link href="/" className="cursor-pointer">
            <Logo />
          </Link>
        </div>
        {/* <div className="w-[1px] bg-[#E7E7E7]" /> */}
      </div>
      <ul className="flex items-center space-x-4">
        {navItems.map((item: any, index: number) => (
          <li key={index}>
            <Link
              href={item.href}
              onClick={() => {
                if (typeof window !== "undefined" && window.ym) {
                  window.ym(
                    YandexMetrikaId,
                    "reachGoal",
                    `promo/menu${item.href}`,
                  );
                }
              }}
            >
              <p className="text-xs uppercase text-dark-900 hover:text-accent lg:text-base">
                {item.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-end">
        <Link
          href={`tel:${number.phone}`}
          className="cursor-pointer text-[14px] hover:text-accent"
        >
          <p className="">{number.phoneMask}</p>
        </Link>
        <Link
          href="https://yandex.ru/maps/-/CCQtFQdaLA"
          className="cursor-pointer uppercase hover:text-accent"
          target="_blank"
        >
          <p>м. Сокол</p>
        </Link>

        <DialogLinks>
          <button
            className="flex cursor-pointer items-center gap-1"
            type="button"
            aria-label="Открыть qr-код"
          >
            <div className="h-4 w-4">
              <WhatsAppLogo />
            </div>
            <p>Написать в WhatsApp</p>
          </button>
        </DialogLinks>

        {/* <p>10:00 - 20:00</p> */}
      </div>
    </div>
  );
}
