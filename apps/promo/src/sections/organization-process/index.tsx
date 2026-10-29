"use client"

import React, { useState, useEffect, useRef } from 'react'
import s from './organizationProcess.module.css'
import r from './responsive.module.css'
import Image from 'next/image'
import img from '../../../public/bg-organization.webp'
import { AnimatedTitle } from '@/components/animated-title'
import { cn } from '@/lib/utils'

const accordionItems = [
  {
    number: '01',
    title: 'Консультация',
    description: 'В ходе индивидуальной консультации вы познакомитесь со всеми возможностями организации пространств нашей фабрики, увидите  все многообразие материалов и сможет определиться с предварительным бюджетом проекта.'
  },
  {
    number: '02',
    title: 'Разработка проекта',
    description: 'На основе планировки и ваших пожеланий мы разрабатываем проект мебели: продумываем эргономику, сценарии хранения и композицию в пространстве. Готовим визуальные решения и спецификацию материалов, чтобы вы заранее  видели будущий результат и могли уверенно принимать решения. '
  },
  {
    number: '03',
    title: 'Замер и проектирование',
    description: 'Наши специалисты выезжают на объект, выполняют детальный замер помещения и учитывают все технические нюансы: геометрию стен, коммуникации, особенности проёмов. Конструкторское бюро переводит дизайн‑идею в рабочие чертежи, чтобы каждая деталь идеально совпала с реальным пространством.'
  },
  {
    number: '04',
    title: 'Производство',
    description: 'Мебель изготавливается на нашем производстве в Москве с использованием современного европейского оборудования и премиальных материалов. Каждый узел проходит многоступенчатый контроль качества, чтобы готовые изделия выглядели безупречно и служили долгие годы '
  },
  {
    number: '05',
    title: 'Доставка и монтаж',
    description: 'Организуем бережную доставку на объект и аккуратный монтаж собственной бригадой. Все элементы мебели точно подгоняются на месте, а пространство остаётся чистым и готовым к использованию уже в день установки. '
  },
  {
    number: '06',
    title: 'Гарантия и сервис',
    description: 'Мы остаёмся с вами и после завершения проекта: предоставляем гарантию на изделия и оперативно помогаем с любыми вопросами эксплуатации. При необходимости вы можете обратиться за регулировкой, доукомплектацией или обновлением решений под новые задачи интерьера '
  }
]

interface Item {
  description: string
  title: string
  number: string
}

const AnimatedAccordionItem = ({
  item,
  index,
  isActive,
  onClick,
}: {
  item: Item;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
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

  return (
    <div
      ref={ref}
      className={cn(s.accordionItem, r.accordionItem, isActive && s.active, isActive && r.active)}
      onClick={onClick}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.96)",
        transitionProperty: "opacity, transform",
        transitionDuration: "1500ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${(index % 4) * 100}ms`,
      }}
    >
      <div className={cn(s.accordionHeader, r.accordionHeader)}>
        <div className={cn(s.titleWrapper, r.titleWrapper)}>
          <span className={cn(s.number, r.number)}>{item.number}/</span>
          <h3 className={cn(s.title, r.title)}>{item.title}</h3>
        </div>
        <div className={cn(s.icon, r.icon, isActive && s.active, isActive && r.active)}>
          {isActive ? (
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.657227 47.3428H9.20703V48H0V38.1367H0.657227V47.3428ZM48 48H38.1387V47.3428H47.3428V38.1367H48V48ZM9.20703 0.657227H0.657227V9.20508H0V0H9.20703V0.657227ZM48 9.20508H47.3428V0.657227H38.1387V0H48V9.20508Z" fill="#E30613" />
              <g className={s.iconTransform}>
                <path d="M24 14v20" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 24h20" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.657227 47.3428H9.20703V48H0V38.1367H0.657227V47.3428ZM48 48H38.1387V47.3428H47.3428V38.1367H48V48ZM9.20703 0.657227H0.657227V9.20508H0V0H9.20703V0.657227ZM48 9.20508H47.3428V0.657227H38.1387V0H48V9.20508Z" fill="#2F2F2F" />
              <g className={s.iconTransform}>
                <path d="M24 14v20" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 24h20" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          )}
        </div>
      </div>
      <div className={cn(s.accordionContent, r.accordionContent)}>
        <p>{item.description}</p>
      </div>
    </div>
  );
};

const AnimatedProcessImage = ({ src, alt, sizes }: {
  src: any;
  alt: string;
  sizes?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
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

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.96)",
        transitionProperty: "opacity, transform",
        transitionDuration: "1500ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="w-full h-full relative"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
      />
    </div>
  );
};

export default function OrganizationProcess() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const leftSideRef = useRef<HTMLDivElement>(null)
  const [rightSideHeight, setRightSideHeight] = useState<number | null>(null)

  const handleAccordionClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth > 768 && leftSideRef.current) {
        setRightSideHeight(leftSideRef.current.offsetHeight)
      } else {
        setRightSideHeight(null)
      }
    }

    // Small delay to ensure the page layout is settled after initial hydration/render
    const timer = setTimeout(updateHeight, 100)

    window.addEventListener('resize', updateHeight)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  return (
    <section className={cn(s.section, r.section)}>
      <div className="">
        <AnimatedTitle>Как мы организуем процесс - <br /> <span>от идеи до готового интерьера</span></AnimatedTitle>

        <div className={cn(s.processBlock, r.processBlock)}>
          <div ref={leftSideRef} className={cn(s.leftSide, r.leftSide)}>
            <div className={cn(s.accordion, r.accordion)}>
              {accordionItems.map((item, index) => (
                <AnimatedAccordionItem
                  key={index}
                  item={item}
                  index={index}
                  isActive={activeIndex === index}
                  onClick={() => handleAccordionClick(index)}
                />
              ))}
            </div>
          </div>

          <div
            className={cn(s.rightSide, r.rightSide)}
            style={rightSideHeight ? { height: `${rightSideHeight}px` } : undefined}
          >
            <div className={cn(s.imagePlaceholder, r.imagePlaceholder)}>
              <AnimatedProcessImage
                src={img}
                alt="img"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}