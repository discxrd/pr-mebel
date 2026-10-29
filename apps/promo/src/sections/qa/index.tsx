"use client"

import React, { useState, useEffect, useRef } from 'react'

import Image from 'next/image'
import img from '../../../public/bg-organization.webp'
import s from './qa.module.css'
import r from './responsive.module.css'
import { cn } from '@/lib/utils'
import { AnimatedTitle } from '@/components/animated-title'

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
        transitionDelay: `${index < 7 ? (index % 4) * 100 : (index - 7) * 100}ms`,
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

export default function QA({ items, title }: { items: Item[], title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const [showAll, setShowAll] = useState(false)

  const handleAccordionClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const visibleItems = showAll ? items : items.slice(0, 7)

  return (
    <section className={cn(s.section, r.section)}>
      <div className={cn(s.sectionWrapper, r.sectionWrapper)}>
        <AnimatedTitle>{title}</AnimatedTitle>

        <div className={cn(s.processBlock, r.processBlock)}>
          <div className={s.leftSide}>
            <div className={s.accordion}>
              {visibleItems.map((item, index) => (
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


        </div>
        {items.length > 7 && !showAll && (
          <div className={cn(s.btnWrapper, r.btnWrapper)}>
            <button onClick={() => setShowAll(true)}>Смотреть ещё</button>
          </div>
        )}
      </div>
    </section>
  )
}