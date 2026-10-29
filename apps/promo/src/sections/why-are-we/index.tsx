"use client";

import React, { useEffect, useRef, useState } from 'react'
import s from './WhyAreWe.module.css'
import r from './responsive.module.css'
import Image from 'next/image'
import { AnimatedTitle } from '@/components/animated-title'
import { cn } from '@/lib/utils'

import img_cell from '@/../public/cooperation.png'

interface WhyAreWeListProps {
  title: string | null;
  description: string | null;
  icon: string | null;
}
interface WhyAreWeProps {
  type: string;
  title: string;
  description: string;
  list: WhyAreWeListProps[];
}

const cardsImageData = [
  { id: 1, image: '/why-are-we/1.png', className: s.image, alt: 'Преимущество 1', width: 400, height: 450 },
  { id: 2, image: '/why-are-we/2.png', className: s.image, alt: 'Преимущество 2', width: 400, height: 450 },
  { id: 3, image: '/why-are-we/3.png', className: s.image, alt: 'Преимущество 3', width: 400, height: 450 },
  { id: 4, image: '/why-are-we/4.png', className: s.image, alt: 'Преимущество 4', width: 400, height: 450 },
]

const WhyAreWeImage = ({ item, index }: { item: typeof cardsImageData[0]; index: number }) => {
  return (
    <div className={cn(item.className, r.image)}>
      <Image
        src={item.image}
        alt={item.alt}
        width={item.width}
        height={item.height}
        className="w-full h-auto"
        draggable={false}
      />
    </div>
  );
};

const WhyAreWeCard = ({
  item,
  index,
  type,
  className,
}: {
  item: WhyAreWeListProps;
  index: number;
  type: string;
  className: string;
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
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.96)",
        transitionProperty: "opacity, transform",
        transitionDuration: "1500ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${(index % 3) * 150}ms`,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {item.icon && item.title && item.description ? (
        <>
          <div className={cn(s.iconWrapper, r.iconWrapper)}>
            <div className={cn(s.icon, r.icon)}>
              <Image src={item.icon} alt={`svg_${index + 1}`} width={60} height={60} />
            </div>
          </div>

          <div className={cn(s.content, r.content)}>
            <h3 dangerouslySetInnerHTML={{ __html: item.title }} />
            <p dangerouslySetInnerHTML={{ __html: item.description }} />
          </div>
        </>
      ) : (
        <Image className={cn(s.image, r.image)} src={img_cell} alt={`svg_${index + 1}`} width={100} height={100} />
      )}
    </div>
  );
};

export default function WhyAreWe({ type, title, description, list }: WhyAreWeProps) {
  return (
    <section id="advantages" className={cn(s.section, r.section, "scroll-mt-24")}>
      <div className={cn(s.sectionWrapper, r.sectionWrapper)}>
        <AnimatedTitle className={cn(s.title, r.title)}>{title}</AnimatedTitle>
        <AnimatedTitle as='p' className={cn(s.subtitle, r.subtitle)}>
          {description}
        </AnimatedTitle>

        <div className={cn(s.cardsImage, r.cardsImage)}>
          {cardsImageData.map((item, index) => (
            <WhyAreWeImage key={item.id} item={item} index={index} />
          ))}
        </div>
        <div className={cn(s.cardsGrid, r.cardsGrid)}>
          {list.map((item, index) => (
            <WhyAreWeCard
              key={index}
              item={item}
              index={index}
              type={type}
              className={cn(s.card, r.card)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}