import { useState } from "react";
import { YandexMetrikaId } from "@/scripts";
import { number } from "@/variables";
import Link from "next/link";
import { DialogLinks } from "../dialog-links";
import Image from "next/image";

import whatsapp from "../../../public/wa-black.svg";
import telegram from "../../../public/tg-black.svg";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";

export default function MobileNew({ Logo, navItems, WhatsAppIcon }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="container flex h-full items-center justify-between px-4 py-3 text-xs">
      <div className="relative h-full w-[100px] md:w-[175px]">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="default" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col items-center mx-4 mb-4">
          <div className="w-full max-w-3xl">
            <ul className="flex flex-col items-center gap-6 my-6">
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
                      setOpen(false);
                    }}
                  >
                    <p className="text-xl font-medium hover:text-accent py-2">
                      {item.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-4">
              <Link
                href={`tel:74952780285`}
                className="cursor-pointer text-lg hover:text-accent"
              >
                <p>+7 (495) 278-02-85</p>
              </Link>

              <div className="flex gap-6">
                <Link href={"#"}>
                  <Image
                    src={telegram}
                    alt="telegram"
                    width={34}
                    height={34}
                  />
                </Link>
                <Link href={"#"}>
                  <Image
                    src={whatsapp}
                    alt="whatsapp"
                    width={34}
                    height={34}
                  />
                </Link>
              </div>

              <DialogLinks>
                <button
                  className="mt-4 w-full max-w-xs rounded-md bg-primary px-4 py-2 text-sm text-white"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Оставить заявку
                </button>
              </DialogLinks>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}