"use client";

import Image from "next/image";
import { Card } from "./card";
import { cards } from "./cards";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatedTitle } from "@/components/animated-title";

export const Advantages = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Проверка состояния прокрутки
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Определяем текущий активный слайд
      const slideWidth = scrollRef.current.scrollWidth / cards.length;
      const newCurrentSlide = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(newCurrentSlide);
    }
  };

  // Обновляем состояние при монтировании и изменении размера окна
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      checkScroll();

      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  // Прокрутка к определенному слайду с учетом отступов
  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const slideWidth = container.scrollWidth / cards.length;
      const containerWidth = container.clientWidth;

      // Вычисляем позицию для центрирования слайда
      let targetPosition = index * slideWidth;

      // Для первого слайда - выравниваем по левому краю с отступом
      if (index === 0) {
        targetPosition = 0;
      }
      // Для последнего слайда - выравниваем по правому краю
      else if (index === cards.length - 1) {
        targetPosition = container.scrollWidth - containerWidth;
      }
      // Для всех остальных - центрируем
      else {
        targetPosition = targetPosition - containerWidth / 2 + slideWidth / 2;
      }

      container.scrollTo({
        left: targetPosition,
        behavior: "smooth",
      });
    }
  };

  // Прокрутка влево
  const scrollLeft = () => {
    if (currentSlide > 0) {
      scrollToSlide(currentSlide - 1);
    }
  };

  // Прокрутка вправо
  const scrollRight = () => {
    if (currentSlide < cards.length - 1) {
      scrollToSlide(currentSlide + 1);
    }
  };

  // Обновляем состояние после изменения currentSlide
  useEffect(() => {
    checkScroll();
  }, [currentSlide]);

  return (
    <div
      id="advantages"
      className="w-full scroll-mt-[60px] overflow-hidden bg-dark-100"
    >
      <section className="pb-10 pt-16 lg:container lg:pt-20">
        <div className="px-5 lg:px-0">
          <AnimatedTitle as="h3" className="mb-2 uppercase text-dark-700">Преимущества</AnimatedTitle>
          <div className="flex items-center justify-between">
            <AnimatedTitle as="h2" className="mb-2 text-2xl font-medium uppercase md:mb-10 md:text-3xl">
              Почему нам доверяют
            </AnimatedTitle>
            <div className="pointer-events-none z-20 flex w-full items-center justify-end pr-4 lg:hidden">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`pointer-events-auto mx-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[2px] border-dark-500 transition-colors hover:border-dark-700 ${
                  canScrollLeft ? "" : "cursor-not-allowed opacity-50"
                }`}
                aria-label="Предыдущий слайд"
              >
                <ArrowRight color="#4d4d4d" className="h-6 w-6 rotate-180" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`pointer-events-auto mx-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[2px] border-dark-500 transition-colors hover:border-dark-700 ${
                  canScrollRight ? "" : "cursor-not-allowed opacity-50"
                }`}
                aria-label="Следующий слайд"
              >
                <ArrowRight color="#4d4d4d" className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slider */}
        <div className="relative px-5 lg:hidden">
          {/* Кнопки навигации */}

          {/* Горизонтальный скролл с привязкой (snap) */}
          <div
            ref={scrollRef}
            className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-8 pt-4"
            onScroll={checkScroll}
            style={{ scrollBehavior: "smooth" }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="w-[calc(100%-20px)] flex-shrink-0 snap-start sm:w-[calc(90%-20px)] md:w-[400px]"
                style={{ minWidth: "280px", maxWidth: "400px" }}
              >
                <Card {...card} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop (остаётся без изменений) */}
        <div className="hidden grid-cols-12 grid-rows-3 gap-4 lg:grid">
          <div className="relative col-span-6 row-span-full">
            <Image
              src="/advantages.png"
              alt="advantages"
              fill
              priority
              className="h-full w-full object-cover"
            />
          </div>
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Стили для скрытия скроллбара */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
