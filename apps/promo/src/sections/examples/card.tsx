/* eslint-disable @next/next/no-img-element */
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Goal } from "@/hooks/use-metrika";
import { cn } from "@/lib/utils";
import { YandexMetrikaId } from "@/scripts";
import { getDynamicTelegramUrl } from "@/lib/get-dynamic-telegram";
import { getDynamicMaxUrl } from "@/lib/get-dynamic-max";
import { getDynamicWhatsAppUrl } from "@/lib/get-dynamic-whatsapp";
import s from "./examples.module.css";
import r from "./responsive.module.css";
import waIcon from "@/../public/wa-black.svg";
import tgIcon from "@/../public/tg-black.svg";
import maxIcon from "@/../public/max-black.svg";
import maxColorIcon from "@/../public/max-color.svg";
import tgColorIcon from "@/../public/tg-color.svg";
import waColorIcon from "@/../public/wa-color.svg";
import arrow from "@/../public/arrow.svg";
import Link from "next/link";
import { DialogForm } from "../dialog-form";
import { DialogFormFile } from "../dialog-form-file";
type CardProps = {
  index: number;
  goal: Goal;
  title: string;
  main: StaticImageData;
  images: StaticImageData[];
};

const projectDetails: Record<string, {
  facts: { label: string; value: string }[];
  description: string;
}> = {
  "ЖК Садовые кварталы": {
    facts: [
      { label: "Площадь", value: "190 м²" },
      { label: "Сроки", value: "4.5 мес" },
      { label: "Бюджет", value: "4.5 млн. ₽" },
    ],
    description: "Для молодой семьи с тремя детьми по проекту дизайнера мы реализовали корпусную мебель, которая делает пространство удобным для жизни и подчёркивает стиль и характер его владельцев. Нами были изготовлены и смонтированы шпонированные стеновые панели, стеклянный шкаф‑перегородка,угловая система хранения, мебель для мастер‑ванны, мебель для санузла для детей и мебель для трёх детских комнат."
  },
  "ЖК Серебряный бор": {
    facts: [
      { label: "Площадь", value: "95 м²" },
      { label: "Сроки", value: "3 мес" },
      { label: "Бюджет", value: "3.5 млн. ₽" },
    ],
    description: "Интерьер квартиры в ЖК «Серебряный бор» выполнен в лаконичном современном стиле с теплыми натуральными оттенками. Нами реализованы кухня‑гостиная с островом, система хранения в прихожей, мастер‑спальня с панелями из шпона, комната подростка и два санузла. Вся корпусная мебель выдержана в едином стиле и образует цельное, уютное и функциональное пространство для жизни семьи."
  },
  "ЖК Хорошевский": {
    facts: [
      { label: "Площадь", value: "100 м²" },
      { label: "Сроки", value: "3 мес" },
      { label: "Бюджет", value: "2.5 млн. ₽" },
    ],
    description: "Интерьер квартиры в ЖК «Хорошевский» выдержан в современном стиле с мягкими, спокойными оттенками. Мы реализовали кухню и зону гостиной, прихожую с шкафом и мягкими панелями, мастер‑спальню с мягким изголовьем, прикроватными тумбами и подвесной системой, гардеробную и санузел. Вся корпусная мебель выполнена в едином ключе и формирует удобное, функциональное пространство для повседневной жизни."
  },
  "Частный интерьер": {
    facts: [
      { label: "Площадь", value: "220 м²" },
      { label: "Сроки", value: "5 мес" },
      { label: "Бюджет", value: "4 млн. ₽" },
    ],
    description: "Для данного частного интерьера по проекту дизайнера нами были изготовлены кухня, гостиная, гардеробная с зеркальными дверями, рабочая зона со шкафом, 2 спальни, комната подростка, и зоны санузлов. Интерьер выдержан в спокойной нейтральной палитре, благодаря чему пространство выглядит современным и при этом очень домашним."
  },
  "ЖК Пресня Сити": {
    facts: [
      { label: "Площадь", value: "100 м²" },
      { label: "Сроки", value: "3.5 мес" },
      { label: "Бюджет", value: "2.5 млн. ₽" },
    ],
    description: "Интерьер квартиры в ЖК «Пресня Сити» выполнен в современном лаконичном стиле с теплыми нейтральными оттенками. Нами были изготовлены кухня и мебель для зоны гостиной, входная группа со шкафом, консолью и мягкими панелями, а также решения для мастер‑спальни и ванной комнаты. Корпусная мебель поддерживает чистоту линий, избавляет от визуального шума и помогает сохранить ощущение лёгкого, организованного пространства."
  },
  "ЖК Сердце Столицы": {
    facts: [
      { label: "Площадь", value: "110 м²" },
      { label: "Сроки", value: "3.5 мес" },
      { label: "Бюджет", value: "2.8 млн. ₽" },
    ],
    description: "Интерьер квартиры в ЖК «Сердце Столицы» выдержан в современном стиле с теплой нейтральной палитрой и мягкими фактурами. Мы реализовали кухню с небольшой барной стойкой и зоной гостиной, прихожую со встроенными шкафами и скамьей с мягкими панелями, мастер‑спальню с кроватью и высоким мягким изголовьем, прикроватными тумбами и туалетным столиком, гардеробную с витринными шкафами, а также мебель в комнату подростка с рабочим местом и вместительным шкафом. Вся корпусная мебель выполнена в единой стилистике и формирует цельное, удобное для повседневной жизни пространство."
  }
};

const normalizeIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

const getImageKey = (image: StaticImageData) => image.src;

const globalProjectViewedPhotos = new Set<string>();
const globalProjectMilestones = { ten: false, twentyfive: false, fifty: false };

export const Card = ({ images, main, title, goal, index }: CardProps) => {
  const gallery = useMemo(() => {
    const uniqueImages: StaticImageData[] = [];
    const seen = new Set<string>();

    for (const image of images) {
      const key = getImageKey(image);
      if (seen.has(key)) continue;
      seen.add(key);
      uniqueImages.push(image);
    }

    return uniqueImages.length > 0 ? uniqueImages : [main];
  }, [images, main]);

  const [open, setOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDiscussBtn, setShowDiscussBtn] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    if (!viewerOpen) {
      setShowDiscussBtn(true);
      lastScrollTop.current = 0;
    }
  }, [viewerOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > lastScrollTop.current && scrollTop > 50) {
      setShowDiscussBtn(false);
    } else {
      setShowDiscussBtn(true);
    }
    lastScrollTop.current = scrollTop;
  };

  const handleCardOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      e.preventDefault();
      e.stopPropagation();
      setSelectedImageIndex(0);
      setViewerOpen(true);
      localStorage.setItem(goal, "true");
      if (window.ym) {
        window.ym(YandexMetrikaId, "reachGoal", goal);
      }
    }
  };
  const [isImageHovering, setIsImageHovering] = useState(false);
  const [isCardHovering, setIsCardHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const mobileGalleryRef = useRef<HTMLDivElement | null>(null);
  const hasHoveredRef = useRef(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollMobileGallery = (direction: "prev" | "next") => {
    const container = mobileGalleryRef.current;
    if (container) {
      const itemWidth = container.firstElementChild?.getBoundingClientRect().width || 0;
      const gap = 12; // matching responsive.module.css gap
      const scrollAmount = direction === "prev" ? -(itemWidth + gap) : (itemWidth + gap);
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMobileScroll = () => {
    const container = mobileGalleryRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.firstElementChild?.getBoundingClientRect().width || 0;
      const gap = 12; // matching responsive.module.css gap
      if (itemWidth > 0) {
        const index = Math.round(scrollLeft / (itemWidth + gap));
        const normalized = normalizeIndex(index, gallery.length);
        if (normalized !== selectedImageIndex) {
          setSelectedImageIndex(normalized);
        }
      }
    }
  };

  const selectImage = (index: number) => {
    const nextIndex = normalizeIndex(index, gallery.length);
    setSelectedImageIndex(nextIndex);

    const selectedThumbnail = thumbnailRefs.current[nextIndex];
    if (selectedThumbnail) {
      selectedThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setSelectedImageIndex(0);
      setViewerOpen(false);

      if (typeof window !== "undefined") {
        localStorage.setItem(goal, "true");
        if (window.ym) {
          window.ym(YandexMetrikaId, "reachGoal", goal);
        }
      }
    }
  };

  useEffect(() => {
    if (!open) {
      setViewerOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (open || viewerOpen) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("viewed_jk", "true");
        if (sessionStorage.getItem("viewed_catalog_core") === "true" && !sessionStorage.getItem("sent_jk_catalog_goal")) {
          sessionStorage.setItem("sent_jk_catalog_goal", "true");
          if (window.ym) {
            window.ym(YandexMetrikaId, "reachGoal", "viewed_jk_and_catalog");
          }
          console.log("Goal reached: viewed_jk_and_catalog");
        }
      }
    }
  }, [open, viewerOpen]);

  useEffect(() => {
    if (open) {
      const imageKey = `${index}_${selectedImageIndex}`;
      globalProjectViewedPhotos.add(imageKey);
      const count = globalProjectViewedPhotos.size;

      if (count >= 10 && !globalProjectMilestones.ten) {
        globalProjectMilestones.ten = true;
        if (typeof window !== "undefined" && window.ym) {
          window.ym(YandexMetrikaId, "reachGoal", "project_photos_10");
        }
        console.log("Goal reached: project_photos_10");
      }
      if (count >= 25 && !globalProjectMilestones.twentyfive) {
        globalProjectMilestones.twentyfive = true;
        if (typeof window !== "undefined" && window.ym) {
          window.ym(YandexMetrikaId, "reachGoal", "project_photos_25");
        }
        console.log("Goal reached: project_photos_25");
      }
      if (count >= 50 && !globalProjectMilestones.fifty) {
        globalProjectMilestones.fifty = true;
        if (typeof window !== "undefined" && window.ym) {
          window.ym(YandexMetrikaId, "reachGoal", "project_photos_50");
        }
        console.log("Goal reached: project_photos_50");
      }
    }
  }, [selectedImageIndex, open, index]);

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

  const activeImage = gallery[selectedImageIndex] ?? gallery[0] ?? main;
  const isWideImage = activeImage && activeImage.width && activeImage.height
    ? activeImage.width / activeImage.height > 1.2
    : false;

  const details = useMemo(() => {
    return projectDetails[title] || {
      facts: [
        { label: "Площадь", value: "200 м²" },
        { label: "Сроки", value: "2 месяца" },
        { label: "Бюджет", value: "1,2 млн. ₽" },
      ],
      description: "По заказу семьи с тремя детьми мы полностью оборудовали квартиру. Были разработаны дизайн-проекты и изготовлена мебель для 3-х детских комнат и нескольких общих зон. Также спроектированы и оборудованы гардеробные, системы хранения и рабочие зоны. Все работы выполнены в сжатые сроки."
    };
  }, [title]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <div
          ref={cardRef}
          role="button"
          tabIndex={0}
          onMouseEnter={() => {
            setIsCardHovering(true);
            if (!hasHoveredRef.current) {
              hoverTimerRef.current = setTimeout(() => {
                hasHoveredRef.current = true;
                if (typeof window !== "undefined" && window.ym) {
                  window.ym(YandexMetrikaId, "reachGoal", `hover_project_card_${index + 1}`);
                }
              }, 1000);
            }
          }}
          onMouseLeave={() => {
            setIsCardHovering(false);
            if (hoverTimerRef.current) {
              clearTimeout(hoverTimerRef.current);
              hoverTimerRef.current = null;
            }
          }}
          onFocus={() => setIsCardHovering(true)}
          onBlur={() => setIsCardHovering(false)}
          onClick={handleCardOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleCardOpen(e);
            }
          }}
          className={cn(s.cardWrapper, r.cardWrapper)}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.96)",
            transitionProperty: "opacity, transform",
            transitionDuration: "1500ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: `${(index % 2) * 150}ms`,
          }}
        >
          <div
            className={cn(
              s.cardImageContainer,
              r.cardImageContainer,
              isCardHovering && s.cardImageContainerHovered
            )}
          >
            <Image
              src={main}
              alt={title}
              fill
              className={cn(s.cardImage, isCardHovering && s.cardImageHovered)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <div
              className={cn(
                s.cardGradientOverlay,
                isCardHovering && s.cardGradientOverlayHovered
              )}
            />

            <div
              className={cn(
                s.cardDetailsOverlay,
                isCardHovering && s.cardDetailsOverlayHovered
              )}
            >
              <div className={s.cardDetailsContent}>
                <div className={s.cardDetailsFacts}>
                  {details.facts.map((item) => (
                    <div key={item.label} className={s.cardDetailsFactItem}>
                      <p className={cn(s.cardTitleLabel, r.cardTitleLabel)}>
                        {item.label}
                      </p>
                      <p className={cn(s.cardTitleValue, r.cardTitleValue)}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <Image src={arrow} alt="tg" width={34} height={34} />
              </div>
            </div>
          </div>

          <div className={cn(s.cardFooter, r.cardFooter)}>
            <h4 className={cn(s.titleProjectMain, r.titleProjectMain)}>{title}</h4>
            <div className={cn(s.mobileArrowIcon, r.mobileArrowIcon)}>
              <Image src={arrow} alt="arrow" width={24} height={24} />
            </div>
          </div>
        </div>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          ref={overlayRef}
          className={s.dialogOverlay}
        />

        <DialogPrimitive.Content
          onPointerDownOutside={(e) => {
            const target = (e.detail as any)?.originalEvent?.target || e.target;
            if (target && target === overlayRef.current) {
              return;
            }
            e.preventDefault();
          }}
          onInteractOutside={(e) => {
            const target = (e.detail as any)?.originalEvent?.target || e.target;
            if (target && target === overlayRef.current) {
              return;
            }
            e.preventDefault();
          }}
          className={cn(
            s.dialogContent,
            r.dialogContent,
            s.dialogContentMobile,
            r.dialogContentMobile
          )}
        >
          <div className={cn(s.dialogGrid, r.dialogGrid, s.dialogGridMobile, r.dialogGridMobile)}>
            <div className={cn(s.leftColumn, r.leftColumn)}>
              <div
                className={cn(s.mainImageWrapper, r.mainImageWrapper, s.mainImageMobile, r.mainImageMobile)}
                onMouseEnter={() => setIsImageHovering(true)}
                onMouseLeave={() => setIsImageHovering(false)}
                onClick={() => setViewerOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setViewerOpen(true);
                  }
                }}
              >
                {!isWideImage && (
                  <Image
                    src={activeImage}
                    alt="blur background"
                    fill
                    className={s.mainImageBlur}
                    sizes="(max-width: 1024px) 100vw, 64vw"
                  />
                )}
                <Image
                  src={activeImage}
                  alt={title}
                  fill
                  className={s.mainImageObjectContain}
                  sizes="(max-width: 1024px) 100vw, 64vw"
                />

                <div
                  className={cn(
                    s.cardGradientOverlay,
                    isImageHovering && s.cardGradientOverlayHovered,
                    s.imageGradientLeft,
                    r.imageGradientLeft
                  )}
                />
                <div
                  className={cn(
                    s.cardGradientOverlay,
                    isImageHovering && s.cardGradientOverlayHovered,
                    s.imageGradientRight,
                    r.imageGradientRight
                  )}
                />

                <div className={s.navButtonsContainer}>
                  <button
                    type="button"
                    className={cn(s.navBtn, r.navBtnMobile)}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectImage(selectedImageIndex - 1);
                    }}
                    aria-label="Предыдущее фото"
                  >
                    <Image
                      src={arrow}
                      width={44}
                      height={44}
                      className={s.navIconPrev}
                      alt="Предыдущее фото"
                    />
                  </button>

                  <button
                    type="button"
                    className={cn(s.navBtn, r.navBtnMobile)}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectImage(selectedImageIndex + 1);
                    }}
                    aria-label="Следующее фото"
                  >
                    <Image
                      src={arrow}
                      width={44}
                      height={44}
                      className={s.navIconNext}
                      alt="Следующее фото"
                    />
                  </button>
                </div>
              </div>

              {/* Mobile Swipeable Gallery */}
              <div
                className={r.mobileGalleryContainer}
                ref={mobileGalleryRef}
                onScroll={handleMobileScroll}
              >
                {gallery.map((src, i) => (
                  <div
                    key={i}
                    className={r.mobileGalleryItem}
                    onClick={() => {
                      selectImage(i);
                      setViewerOpen(true);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectImage(i);
                        setViewerOpen(true);
                      }
                    }}
                  >
                    <Image
                      src={src}
                      alt="blur background"
                      fill
                      className={r.mobileGalleryImageBlur}
                      sizes="320px"
                    />
                    <Image
                      src={src}
                      alt={`${title} ${i + 1}`}
                      fill
                      className={r.mobileGalleryImageContain}
                      sizes="320px"
                    />
                  </div>
                ))}
              </div>

              {/* Centered mobile navigation arrows below the image */}
              <div className={cn(r.mobileNavContainer)}>
                <div className={r.cornerFrame}>
                  <span className={cn(r.corner, r.topLeft)} />
                  <span className={cn(r.corner, r.topRight)} />
                  <span className={cn(r.corner, r.bottomLeft)} />
                  <span className={cn(r.corner, r.bottomRight)} />
                  <button
                    type="button"
                    className={r.mobileNavArrow}
                    onClick={(event) => {
                      event.stopPropagation();
                      scrollMobileGallery("prev");
                    }}
                    aria-label="Предыдущее фото"
                  >
                    <Image
                      src={arrow}
                      width={44}
                      height={44}
                      className={s.navIconPrev}
                      alt="Предыдущее фото"
                    />
                  </button>
                </div>

                <div className={r.cornerFrame}>
                  <span className={cn(r.corner, r.topLeft)} />
                  <span className={cn(r.corner, r.topRight)} />
                  <span className={cn(r.corner, r.bottomLeft)} />
                  <span className={cn(r.corner, r.bottomRight)} />
                  <button
                    type="button"
                    className={r.mobileNavArrow}
                    onClick={(event) => {
                      event.stopPropagation();
                      scrollMobileGallery("next");
                    }}
                    aria-label="Следующее фото"
                  >
                    <Image
                      src={arrow}
                      width={44}
                      height={44}
                      className={s.navIconNext}
                      alt="Следующее фото"
                    />
                  </button>
                </div>
              </div>

              <div className={s.thumbnailWrapper}>
                <ScrollArea className={s.wFull}>
                  <div className={s.thumbnailList}>
                    {gallery.map((src, index) => (
                      <button
                        key={index}
                        ref={(el) => {
                          thumbnailRefs.current[index] = el;
                        }}
                        type="button"
                        onClick={() => selectImage(index)}
                        className={cn(
                          s.thumbnailBtn,
                          r.thumbnailBtn,
                          s.thumbnailBtnMobile,
                          r.thumbnailBtnMobile,
                          selectedImageIndex === index && s.thumbnailBtnActive,
                          selectedImageIndex === index && s.thumbnailActiveMobile,
                          selectedImageIndex === index && r.thumbnailActiveMobile
                        )}
                      >
                        <Image
                          src={src}
                          alt="blur background"
                          fill
                          className={s.thumbnailImageBlur}
                          sizes="118px"
                        />
                        <Image
                          src={src}
                          alt={`${title} ${index + 1}`}
                          fill
                          className={s.thumbnailImageMain}
                          sizes="118px"
                        />
                        {selectedImageIndex === index ? (
                          <div className={s.thumbnailActiveOverlay} />
                        ) : null}
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>

            <div className={cn(s.rightColumn, r.rightColumn)}>
              <div className={cn(s.dialogInfoRow, r.dialogInfoRow)}>
                <div className={cn(s.dialogInfoContent, r.dialogInfoContent)}>
                  <DialogPrimitive.Title asChild>
                    <h3 className={cn(s.dialogTitle, r.dialogTitle, s.titleMobile, r.titleMobile)}>
                      {title}
                    </h3>
                  </DialogPrimitive.Title>

                  <div className={cn(s.dialogFacts, r.dialogFacts, s.factsMobile, r.factsMobile)}>
                    {details.facts.map((item) => (
                      <div key={item.label} className={cn(s.factItem, r.factItem)}>
                        <p className={cn(s.factLabel, r.factLabel)}>
                          {item.label}
                        </p>
                        <p className={cn(s.factValue, r.factValue)}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cn(s.dialogDescriptionBlock, r.dialogDescriptionBlock, s.descriptionMobile, r.descriptionMobile)}>
                <p className={cn(s.dialogDescriptionTitle, r.dialogDescriptionTitle, s.descriptionTitleMobile, r.descriptionTitleMobile)}>
                  Что было сделано:
                </p>
                <p className={cn(s.dialogDescriptionText, r.dialogDescriptionText, s.descriptionTextMobile, r.descriptionTextMobile)}>
                  {details.description}
                </p>
              </div>

              <div className={cn(s.dialogActions, r.dialogActions, s.bottomActionsMobile, r.bottomActionsMobile)}>
                <div className={r.socialActionsContainer}>
                  <div className={r.cornerFrame}>
                    <span className={cn(r.corner, r.topLeft)} />
                    <span className={cn(r.corner, r.topRight)} />
                    <span className={cn(r.corner, r.bottomLeft)} />
                    <span className={cn(r.corner, r.bottomRight)} />
                    <div className={cn(s.socialBtnWrapper, r.socialBtnWrapper)}>
                      <Link
                        href="https://max.ru/u/f9LHodD0cOLsEIpAKED0TGn_IUduLG6ceDdyO0f-G34dHwLnPeVS0L5gaIc"
                        target="_blank"
                        className={cn(s.socialBtn, s.socialBtnMobile, r.socialBtnMobile, r.socialBtn)}
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof window !== "undefined" && window.ym) {
                            window.ym(YandexMetrikaId, "reachGoal", "promo/link/max");
                          }
                          const url = getDynamicMaxUrl("https://max.ru/u/f9LHodD0cOLsEIpAKED0TGn_IUduLG6ceDdyO0f-G34dHwLnPeVS0L5gaIc");
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      >
                        <Image src={maxIcon} alt="max" width={56} height={56} className={cn(s.socialIconImg, r.socialIconImg)} />
                      </Link>
                      <Link
                        href="https://t.me/chastniy_mebelier"
                        target="_blank"
                        className={cn(s.socialBtn, s.socialBtnMobile, r.socialBtnMobile, r.socialBtn)}
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof window !== "undefined" && window.ym) {
                            window.ym(YandexMetrikaId, "reachGoal", "promo/link/telegram");
                          }
                          const url = getDynamicTelegramUrl("https://t.me/chastniy_mebelier");
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      >
                        <Image src={tgIcon} alt="telegram" width={56} height={56} className={cn(s.socialIconImg, r.socialIconImg)} />
                      </Link>
                      <Link
                        href="https://wa.me/79031119466"
                        target="_blank"
                        className={cn(s.socialBtn, s.socialBtnMobile, r.socialBtnMobile, r.socialBtn)}
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof window !== "undefined" && window.ym) {
                            window.ym(YandexMetrikaId, "reachGoal", "promo/link/whatsapp");
                          }
                          const url = getDynamicWhatsAppUrl("79031119466");
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      >
                        <Image src={waIcon} alt="wa" width={56} height={56} className={cn(s.socialIconImg, r.socialIconImg)} />
                      </Link>
                    </div>
                  </div>
                </div>
                <DialogFormFile submitText="ОБСУДИТЬ ПРОЕКТ" formName={`Пример работы: ${title}`}>
                  <button
                    type="button"
                    className={cn(
                      s.dialogSubmitBtn,
                      r.dialogSubmitBtn,
                      s.submitBtnMobile,
                      r.submitBtnMobile
                    )}
                  >
                    ОБСУДИТЬ ПРОЕКТ
                  </button>
                </DialogFormFile>
              </div>
            </div>
          </div>

          <DialogPrimitive.Close
            className={cn(s.dialogClose, r.dialogClose)}
            aria-label="Закрыть окно"
          >
            <X className={cn(s.closeIcon, r.closeIcon)} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>

      <DialogPrimitive.Root open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className={cn(s.viewerOverlay, r.viewerOverlay)} />
          <DialogPrimitive.Content className={cn(s.viewerContent, r.viewerContent)}>
            <DialogPrimitive.Title className="sr-only">
              Просмотр фото {title}
            </DialogPrimitive.Title>
            <div className={s.viewerDesktopContainer}>
              <div className={s.viewerDesktopImageArea}>
                <div className={s.viewerDesktopImageWrapper}>
                  <Image
                    src={activeImage}
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
                      <DialogFormFile submitText="Обсудить проект" formName={`Пример работы: ${title}`}>
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
                          <Image src={maxColorIcon} alt="MAX" className={s.viewerSocialIconImgDesktop} />
                        </Link>
                        <Link
                          href="https://t.me/chastniy_mebelier"
                          target="_blank"
                          className={s.viewerSocialLinkDesktop}
                          onClick={(e) => {
                            e.preventDefault();
                            if (typeof window !== "undefined" && window.ym) {
                              window.ym(YandexMetrikaId, "reachGoal", "promo/link/telegram");
                            }
                            const url = getDynamicTelegramUrl("https://t.me/chastniy_mebelier");
                            window.open(url, "_blank", "noopener,noreferrer");
                          }}
                        >
                          <Image src={tgColorIcon} alt="Telegram" className={s.viewerSocialIconImgDesktop} />
                        </Link>
                        <Link
                          href="https://wa.me/79031119466"
                          target="_blank"
                          className={s.viewerSocialLinkDesktop}
                          onClick={(e) => {
                            e.preventDefault();
                            if (typeof window !== "undefined" && window.ym) {
                              window.ym(YandexMetrikaId, "reachGoal", "promo/link/whatsapp");
                            }
                            const url = getDynamicWhatsAppUrl("79031119466");
                            window.open(url, "_blank", "noopener,noreferrer");
                          }}
                        >
                          <Image src={waColorIcon} alt="WhatsApp" className={s.viewerSocialIconImgDesktop} />
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
                          sizes="103px"
                        />
                        <Image
                          src={src}
                          alt={`${title} ${index + 1}`}
                          fill
                          className={s.viewerThumbnailImage}
                          sizes="103px"
                        />
                        {selectedImageIndex === index ? (
                          <div className={s.viewerThumbnailOverlay} />
                        ) : null}
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

            <div className={s.viewerMobileContainer} onScroll={handleScroll}>
              <div className={cn(s.viewerMobileList, r.viewerMobileList)}>
                {gallery.map((src, i) => (
                  <div key={i} className={s.viewerMobileItem}>
                    <Image
                      src={src}
                      alt={title}
                      data-loaded="false"
                      onLoad={(event: any) => {
                        event.currentTarget.setAttribute("data-loaded", "true");
                      }}
                      className={s.viewerMobileImage}
                    />
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
                <div className="flex flex-col items-center gap-2 w-full">
                  <DialogFormFile submitText="Обсудить проект" formName={`Пример работы: ${title}`}>
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
                      <Image src={maxColorIcon} alt="MAX" className={s.viewerSocialIconImgMobile} />
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
                      <Image src={tgColorIcon} alt="Telegram" className={s.viewerSocialIconImgMobile} />
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
                      <Image src={waColorIcon} alt="WhatsApp" className={s.viewerSocialIconImgMobile} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </DialogPrimitive.Root>
  );
};
