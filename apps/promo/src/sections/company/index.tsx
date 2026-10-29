'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MoveRight, MoveLeft } from 'lucide-react';
import { AnimatedTitle } from '@/components/animated-title';
import s from './company.module.css';
import r from './responsive.module.css';
import { cn } from '@/lib/utils';

const images = [
  { src: '/company/v3/1.png', width: 220, height: 220 },
  { src: '/company/v3/2.png', width: 220, height: 220 },
  { src: '/company/v3/3.png', width: 220, height: 220 },
  { src: '/company/v3/4.png', width: 220, height: 220 },
  { src: '/company/v3/5.png', width: 220, height: 220 },
  { src: '/company/v3/6.png', width: 220, height: 220 },
  { src: '/company/v3/7.png', width: 220, height: 220 },
  { src: '/company/v3/8.png', width: 220, height: 220 },
  { src: '/company/v3/9.png', width: 220, height: 220 },
  { src: '/company/v3/10.png', width: 220, height: 220 },
];

const AnimatedCompanyCard = ({
  img,
  index,
}: {
  img: { src: string; width: number; height: number };
  index: number;
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
        transitionDelay: `${(index % 5) * 100}ms`,
      }}
      className={cn(s.cardWrapper, r.cardWrapper)}
    >
      <Image
        src={img.src}
        alt={`Проект ${(index % 10) + 1}`}
        width={img.width}
        height={img.height}
        className={cn(s.cardImage, r.cardImage)}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
    </div>
  );
};

export default function Company() {
  return (
    <section className={cn(s.sectionRoot, r.sectionRoot)}>
      <div className={cn(s.section, r.section)}>
        <div className={cn(s.titleWrapper, r.titleWrapper)}>
          <AnimatedTitle as='h2' className={cn(s.title, r.title)}>Наши проекты украшают <br />
            <span> лучшие апартаменты Москвы</span>
          </AnimatedTitle>

        </div>
        <div className={cn(s.cardsWrapper, r.cardsWrapper)}>
          {images.map((img, index) => (
            <AnimatedCompanyCard
              key={index}
              img={img}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}