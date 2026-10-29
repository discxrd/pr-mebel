"use client";

import React, { useEffect, useRef, useState } from 'react'
import styles from './finishingTechnologies.module.css'
import r from './responsive.module.css'
import { AnimatedTitle } from '@/components/animated-title'
import { cn } from '@/lib/utils'

interface FinishingCardProps {
  index: number;
  className?: string;
  children: React.ReactNode;
}

const FinishingCard = ({ index, className, children }: FinishingCardProps) => {
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
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.96)",
        transitionProperty: "opacity, transform",
        transitionDuration: "1500ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${(index % 3) * 150}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default function FinishingTechnologies() {
  return (
    <section className={cn(styles.section, r.section)}>
      <div className={cn(styles.container, r.container)}>
        <AnimatedTitle>Уникальность и персонализация <br /> <span> в каждой детали</span></AnimatedTitle>
        <AnimatedTitle as='p'>Выбирайте то, что вдохновляет именно Вас</AnimatedTitle>
        <div className={cn(styles.cardsGrid, r.cardsGrid)}>
          <FinishingCard index={0} className={cn(styles.card, r.card, styles.cardLarge, r.cardLarge)}>
            <h3>Авторские <br /> фасады</h3>
            <p>Коллекция авторских фасадов или точная реализация задумки дизайнера — максимум возможностей для вашего интерьера.</p>
          </FinishingCard>
          
          <FinishingCard index={1} className={cn(styles.card, r.card)}>
            <h3>Дизайнерские <br /> ручки </h3>
            <p>Подберем или изготовим фурнитуру под ваш проект - от скрытых профилей до эксклюзивных ручек </p>
          </FinishingCard>
          
          <FinishingCard index={2} className={cn(styles.card, r.card)}>
            <h3>Шпонированные  панели <br /> с отделкой латунью</h3>
            <p>Более 300 видов декоративного шпона с любыми отделками и раскладками под ваш проект.</p>
          </FinishingCard>
          
          <FinishingCard index={3} className={cn(styles.card, r.card)}>
            <h3>Эксклюзивные <br /> органайзеры</h3>
            <p>Разрабатываем персональные системы хранения для любимых вещей</p>
          </FinishingCard>
          
          <FinishingCard index={4} className={cn(styles.card, r.card)}>
            <h3>Декоративные <br /> элементы с обивкой</h3>
            <p>От стеновых панелей до индивидуальных решений для прихожих и детских комнат. Более 1000 вариантов тканей на заказ.</p>
          </FinishingCard>
        </div>
      </div>
    </section>
  )
}