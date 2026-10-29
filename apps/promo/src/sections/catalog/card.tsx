"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Goal } from "@/hooks/use-metrika";
import { cn } from "@/lib/utils";
import { YandexMetrikaId } from "@/scripts";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./catalog.module.css";
import r from "./responsive.module.css";
import arrow from "@/../public/arrow.svg";
import Link from "next/link";
import maxIcon from "@/../public/max-color.svg";
import tgIcon from "@/../public/tg-color.svg";
import waIcon from "@/../public/wa-color.svg";
import { getDynamicMaxUrl } from "@/lib/get-dynamic-max";
import { getDynamicTelegramUrl } from "@/lib/get-dynamic-telegram";
import { getDynamicWhatsAppUrl } from "@/lib/get-dynamic-whatsapp";
import { DialogForm } from "../dialog-form";
import { DialogFormFile } from "../dialog-form-file";

type CardProps = {
  index: number;
  goal: Goal;
  title: string;
  main: StaticImageData;
  images: StaticImageData[];
};

const DESCRIPTIONS: Record<string, string> = {
  "КУХНИ": "Индивидуальный стиль для сердца Вашего дома.",
  "ГАРДЕРОБНЫЕ": "Элегантные решения для функциональных пространств.",
  "ГОСТИНЫЕ": "Комфорт и уют в каждой детали.",
  "ДЕТСКИЕ": "Безопасные решения для особо важных персон.",
  "ШКАФЫ": "Совершенный дизайн. Максимальная функциональность",
  "МЕБЕЛЬ ДЛЯ ВАННЫ": "Приватное пространство, продуманное до мелочей",
};

const globalCatalogViewedPhotos = new Set<string>();
const globalCatalogMilestones = { ten: false, twentyfive: false, fifty: false };

export const Card = ({ images, main, title, goal, index }: CardProps) => {
  const gallery = images.length > 0 ? images : [main];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const activeImage = gallery[selectedImageIndex];
  const isWideImage = activeImage && activeImage.width && activeImage.height
    ? activeImage.width / activeImage.height > 1.2
    : false;
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasHoveredRef = useRef(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showDiscussBtn, setShowDiscussBtn] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setShowDiscussBtn(true);
      lastScrollTop.current = 0;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== "undefined") {
        const isCore = ["КУХНИ", "ГАРДЕРОБНЫЕ", "ШКАФЫ"].includes(title);

        if (isCore) {
          sessionStorage.setItem("viewed_catalog_core", "true");
          
          if (sessionStorage.getItem("viewed_jk") === "true" && !sessionStorage.getItem("sent_jk_catalog_goal")) {
            sessionStorage.setItem("sent_jk_catalog_goal", "true");
            if (window.ym) {
              window.ym(YandexMetrikaId, "reachGoal", "viewed_jk_and_catalog");
            }
            console.log("Goal reached: viewed_jk_and_catalog");
          }

          if (sessionStorage.getItem("viewed_catalog_other") === "true" && !sessionStorage.getItem("sent_catalog_mixed_goal")) {
            sessionStorage.setItem("sent_catalog_mixed_goal", "true");
            if (window.ym) {
              window.ym(YandexMetrikaId, "reachGoal", "viewed_catalog_mixed");
            }
            console.log("Goal reached: viewed_catalog_mixed");
          }
        } else {
          sessionStorage.setItem("viewed_catalog_other", "true");

          if (sessionStorage.getItem("viewed_catalog_core") === "true" && !sessionStorage.getItem("sent_catalog_mixed_goal")) {
            sessionStorage.setItem("sent_catalog_mixed_goal", "true");
            if (window.ym) {
              window.ym(YandexMetrikaId, "reachGoal", "viewed_catalog_mixed");
            }
            console.log("Goal reached: viewed_catalog_mixed");
          }
        }
      }
    }
  }, [isOpen, title]);

  useEffect(() => {
    if (isOpen) {
      const imageKey = `${index}_${selectedImageIndex}`;
      globalCatalogViewedPhotos.add(imageKey);
      const count = globalCatalogViewedPhotos.size;

      if (count >= 10 && !globalCatalogMilestones.ten) {
        globalCatalogMilestones.ten = true;
        if (typeof window !== "undefined" && window.ym) {
          window.ym(YandexMetrikaId, "reachGoal", "catalog_photos_10");
        }
        console.log("Goal reached: catalog_photos_10");
      }
      if (count >= 25 && !globalCatalogMilestones.twentyfive) {
        globalCatalogMilestones.twentyfive = true;
        if (typeof window !== "undefined" && window.ym) {
          window.ym(YandexMetrikaId, "reachGoal", "catalog_photos_25");
        }
        console.log("Goal reached: catalog_photos_25");
      }
      if (count >= 50 && !globalCatalogMilestones.fifty) {
        globalCatalogMilestones.fifty = true;
        if (typeof window !== "undefined" && window.ym) {
          window.ym(YandexMetrikaId, "reachGoal", "catalog_photos_50");
        }
        console.log("Goal reached: catalog_photos_50");
      }
    }
  }, [selectedImageIndex, isOpen, index]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > lastScrollTop.current && scrollTop > 50) {
      setShowDiscussBtn(false);
    } else {
      setShowDiscussBtn(true);
    }
    lastScrollTop.current = scrollTop;
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      if (typeof window !== "undefined") {
        localStorage.setItem(goal, "true");
        console.log("Goal logged to localStorage:", goal);
        if (window.ym) {
          window.ym(YandexMetrikaId, "reachGoal", goal);
        }
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const openParam = params.get('open');
      if (openParam && openParam.toUpperCase() === title.toUpperCase()) {
        setIsOpen(true);
        window.history.replaceState(null, '', window.location.pathname + '#catalog');
      }
    }

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && customEvent.detail.toUpperCase() === title.toUpperCase()) {
        setIsOpen(true);
      }
    };

    window.addEventListener('open-catalog-card', handleCustomEvent);
    return () => {
      window.removeEventListener('open-catalog-card', handleCustomEvent);
    };
  }, [title]);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "-65px 0px -65px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const selectImage = (index: number) => {
    const normalizedIndex = ((index % gallery.length) + gallery.length) % gallery.length;

    setSelectedImageIndex(normalizedIndex);

    const selectedThumbnail = thumbnailRefs.current[normalizedIndex];
    if (selectedThumbnail) {
      selectedThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild className={s.cardTrigger}>
        <div
          ref={cardRef}
          className={cn(s.card, r.card, s.cardWrapper, r.cardWrapper)}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.96)",
            transitionProperty: "opacity, transform",
            transitionDuration: "1500ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: `${(index % 3) * 150}ms`,
          }}
          onMouseEnter={() => {
            if (!hasHoveredRef.current) {
              hoverTimerRef.current = setTimeout(() => {
                hasHoveredRef.current = true;
                if (typeof window !== "undefined" && window.ym) {
                  window.ym(YandexMetrikaId, "reachGoal", `hover_catalog_card_${index + 1}`);
                }
              }, 1000);
            }
          }}
          onMouseLeave={() => {
            if (hoverTimerRef.current) {
              clearTimeout(hoverTimerRef.current);
              hoverTimerRef.current = null;
            }
          }}
        >
          <div className={cn(s.cardImage, r.cardImage, s.cardImageContainer, r.cardImageContainer)}>
            <Image
              src={main}
              alt={title}
              width={main.width}
              height={main.height}
              className={s.cardImg}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <div className={cn(s.cardOverlay, r.cardOverlay)}>
              <p>{DESCRIPTIONS[title.toUpperCase()] || `Небольшой текст про ${title.toLowerCase()}`}</p>
              <div className={s.cardOverlayLine} />
            </div>
          </div>

          <div className={cn(s.cardFooter, r.cardFooter)}>
            <div className={cn(s.cardFooterText, r.cardFooterText)}>
              <p className={cn(s.mobileDescription, r.mobileDescription)}>
                {DESCRIPTIONS[title.toUpperCase()] || `Небольшой текст про ${title.toLowerCase()}`}
              </p>
              <h4 className={cn(s.titleProjectMain, r.titleProjectMain)}>{title}</h4>
            </div>
            <span>{gallery.length} фото</span>
            <div className={cn(s.mobileArrowIcon, r.mobileArrowIcon)}>
              <Image src={arrow} alt="arrow" width={24} height={24} />
            </div>
          </div>
        </div>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={s.viewerOverlay} />
        <DialogPrimitive.Content className={cn(s.viewerContent, r.viewerContent)}>
          <DialogPrimitive.Title className="sr-only">
            Просмотр фото {title}
          </DialogPrimitive.Title>

          <div className={s.viewerMobileContainer} onScroll={handleScroll}>
            <div className={cn(s.viewerMobileList, r.viewerMobileList)}>
              {gallery.map((src, index) => (
                <div key={index} className={s.viewerMobileItem}>
                  <Image src={src} alt={`${title} ${index + 1}`} className={s.viewerMobileImage} />
                </div>
              ))}

              <DialogPrimitive.Close asChild>
                <Button
                  variant="outlined"
                  size="icon"
                  className={s.viewerMobileCloseBtn}
                >
                  <X className={s.viewerNavIcon} />
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div
              className={cn(
                s.viewerMobileDiscussBtnWrapper,
                r.viewerMobileDiscussBtnWrapper,
                !showDiscussBtn && s.viewerMobileDiscussBtnWrapperHidden
              )}
            >
              <div className="flex flex-col items-center gap-2.5 w-full">
                <DialogFormFile submitText="Обсудить проект" formName={`Карточка каталога: ${title}`}>
                  <button className={cn(s.discussProjectBtnMobile, r.discussProjectBtnMobile)}>
                    Обсудить проект
                  </button>
                </DialogFormFile>
                <div className={s.viewerSocialList}>
                  <Link
                    href="https://max.ru/u/f9LHodD0cOLsEIpAKED0TGn_IUduLG6ceDdyO0f-G34dHwLnPeVS0L5gaIc"
                    target="_blank"
                    className={s.viewerSocialLinkMobile}
                    title="MAX"
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof window !== "undefined" && window.ym) {
                        window.ym(YandexMetrikaId, "reachGoal", "promo/link/max");
                      }
                      const url = getDynamicMaxUrl("https://max.ru/u/f9LHodD0cOLsEIpAKED0TGn_IUduLG6ceDdyO0f-G34dHwLnPeVS0L5gaIc");
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <Image src={maxIcon} alt="MAX" className={s.viewerSocialIconImgMobile} />
                  </Link>
                  <Link
                    href="https://t.me/chastniy_mebelier"
                    target="_blank"
                    className={s.viewerSocialLinkMobile}
                    title="Telegram"
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof window !== "undefined" && window.ym) {
                        window.ym(YandexMetrikaId, "reachGoal", "promo/link/telegram");
                      }
                      const url = getDynamicTelegramUrl("https://t.me/chastniy_mebelier");
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <Image src={tgIcon} alt="Telegram" className={s.viewerSocialIconImgMobile} />
                  </Link>
                  <Link
                    href="https://wa.me/79031119466"
                    target="_blank"
                    className={s.viewerSocialLinkMobile}
                    title="WhatsApp"
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof window !== "undefined" && window.ym) {
                        window.ym(YandexMetrikaId, "reachGoal", "promo/link/whatsapp");
                      }
                      const url = getDynamicWhatsAppUrl("79031119466");
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <Image src={waIcon} alt="WhatsApp" className={s.viewerSocialIconImgMobile} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={s.viewerDesktopContainer}>
            <div className={s.viewerDesktopImageArea}>
              <div className={s.viewerDesktopImageWrapper}>
                {!isWideImage && (
                  <Image
                    src={gallery[selectedImageIndex]!}
                    alt="blur background"
                    fill
                    className={s.viewerMainImageBlur}
                    sizes="100vw"
                  />
                )}
                <Image
                  src={gallery[selectedImageIndex]!}
                  alt={title}
                  fill
                  className={s.viewerMainImage}
                  sizes="100vw"
                />

                <Button
                  onClick={() => selectImage(selectedImageIndex - 1)}
                  variant="outlined"
                  size="icon"
                  className={cn(s.viewerNavBtn, s.viewerNavBtnLeft)}
                >
                  <ChevronLeft className={s.viewerNavIcon} />
                </Button>

                <Button
                  onClick={() => selectImage(selectedImageIndex + 1)}
                  variant="outlined"
                  size="icon"
                  className={cn(s.viewerNavBtn, s.viewerNavBtnRight)}
                >
                  <ChevronRight className={s.viewerNavIcon} />
                </Button>

                <div className={cn(s.viewerDiscussBtnWrapper, r.viewerDiscussBtnWrapper)}>
                  <div className="flex flex-col items-center gap-2.5">
                    <DialogFormFile submitText="Обсудить проект" formName={`Карточка каталога: ${title}`}>
                      <button className={cn(s.discussProjectBtn, r.discussProjectBtn)}>
                        Обсудить проект
                      </button>
                    </DialogFormFile>
                    <div className={s.viewerSocialList}>
                      <Link
                        href="https://max.ru/u/f9LHodD0cOLsEIpAKED0TGn_IUduLG6ceDdyO0f-G34dHwLnPeVS0L5gaIc"
                        target="_blank"
                        className={s.viewerSocialLinkDesktop}
                        title="MAX"
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof window !== "undefined" && window.ym) {
                            window.ym(YandexMetrikaId, "reachGoal", "promo/link/max");
                          }
                          const url = getDynamicMaxUrl("https://max.ru/u/f9LHodD0cOLsEIpAKED0TGn_IUduLG6ceDdyO0f-G34dHwLnPeVS0L5gaIc");
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      >
                        <Image src={maxIcon} alt="MAX" className={s.viewerSocialIconImgDesktop} />
                      </Link>
                      <Link
                        href="https://t.me/chastniy_mebelier"
                        target="_blank"
                        className={s.viewerSocialLinkDesktop}
                        title="Telegram"
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof window !== "undefined" && window.ym) {
                            window.ym(YandexMetrikaId, "reachGoal", "promo/link/telegram");
                          }
                          const url = getDynamicTelegramUrl("https://t.me/chastniy_mebelier");
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      >
                        <Image src={tgIcon} alt="Telegram" className={s.viewerSocialIconImgDesktop} />
                      </Link>
                      <Link
                        href="https://wa.me/79031119466"
                        target="_blank"
                        className={s.viewerSocialLinkDesktop}
                        title="WhatsApp"
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof window !== "undefined" && window.ym) {
                            window.ym(YandexMetrikaId, "reachGoal", "promo/link/whatsapp");
                          }
                          const url = getDynamicWhatsAppUrl("79031119466");
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      >
                        <Image src={waIcon} alt="WhatsApp" className={s.viewerSocialIconImgDesktop} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={s.viewerThumbnailContainer}>
              <ScrollArea className={s.wFull}>
                <div className={s.viewerThumbnailList}>
                  {gallery.map((src, index) => (
                    <button
                      key={index}
                      ref={(el) => {
                        thumbnailRefs.current[index] = el;
                      }}
                      onClick={() => selectImage(index)}
                      className={cn(
                        s.viewerThumbnailBtn,
                        selectedImageIndex === index && s.viewerThumbnailBtnActive
                      )}
                    >
                      <Image
                        src={src}
                        alt="blur background"
                        fill
                        className={s.viewerThumbnailBlur}
                        sizes="160px"
                    />
                      <Image
                        src={src}
                        alt={`${title} ${index + 1}`}
                        fill
                        className={s.viewerThumbnailImage}
                        sizes="160px"
                      />
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <DialogPrimitive.Close asChild>
              <Button
                variant="outlined"
                size="icon"
                className={s.viewerCloseBtn}
              >
                <X className={s.viewerNavIcon} />
              </Button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
