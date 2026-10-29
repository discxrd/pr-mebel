"use client";

import React, { useEffect, useRef, useState } from 'react'
import s from './about.module.css'
import r from './responsive.module.css'
import { cn } from '@/lib/utils'
import { AnimatedTitle } from '@/components/animated-title'
import iconCoop1 from "public/about/coop/1-about.svg"
import iconCoop2 from "public/about/coop/2-about.svg"
import iconCoop3 from "public/about/coop/3-about.svg"
const AboutItem = ({ index, children }: { index: number; children: React.ReactNode }) => {
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
      className={cn(s.aboutItem, r.aboutItem)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.96)",
        transitionProperty: "opacity, transform",
        transitionDuration: "1500ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${(index % 4) * 100}ms`,
      }}
    >
      {children}
    </div>
  );
};

const AboutItemCooperation = ({ index, children }: { index: number; children: React.ReactNode }) => {
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
      className={cn(s.aboutItemCooperation, r.aboutItemCooperation)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.96)",
        transitionProperty: "opacity, transform",
        transitionDuration: "1500ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${(index % 3) * 100}ms`,
      }}
    >
      {children}
    </div>
  );
};

function About({ text, type }: { text: string, type: string }) {
  return (
    <section className={cn(s.section, r.section, type === 'cooperation' && s.sectionCooperation, type === 'cooperation' && r.sectionCooperation)}>
      <div className={cn(s.innerContainer, r.innerContainer)}>
        <div className={cn(s.headWrapper, r.headWrapper, type === 'cooperation' && s.headWrapperCooperation, type === 'cooperation' && r.headWrapperCooperation)}>
          {/* <div className={cn(s.titleWrapper, r.titleWrapper)}></div> */}
          <AnimatedTitle as="h4">
            {type === 'main' ? (
              <>Мы создаём мебель, которая становится естественным отражением вашего уникального стиля, <span>превращая индивидуальные эскизы в объекты</span>, наполняющие  интерьер атмосферой гармонии и уюта</>) : <>Ваш надежный партнер <span>в создании эксклюзивных интерьеров.</span> Доверьте нам реализацию  проектов — сосредоточьтесь на творчестве, а мы обеспечим <span>безупречное качество и сроки.</span> </>}
          </AnimatedTitle>
        </div>

        <div className={cn(
          type === 'main' ? s.bodyWrapperList : s.bodyWrapperListCooperation,
          type === 'main' ? r.bodyWrapperList : r.bodyWrapperListCooperation
        )}>
          {type === 'main' && (
            <>
              <AboutItem index={0}>
                <div className={cn(s.aboutMainTitle, r.aboutMainTitle)}>
                  <h4>25 лет <br /> в премиум‑сегменте</h4>
                  <div className={cn(s.liener, r.liener)}></div>
                  <p>Только продуманные решения, без экспериментов на вашем объекте.</p>
                </div>
              </AboutItem>
              <AboutItem index={1}>
                <div className={cn(s.aboutMainTitle, r.aboutMainTitle)}>
                  <h4>Собственное производство</h4>
                  <div className={cn(s.liener, r.liener)}></div>
                  <p>Лично отвечаем за результат под ключ - <br /> от проектирования до монтажа.</p>
                </div>
              </AboutItem>
              <AboutItem index={2}>
                <div className={cn(s.aboutMainTitle, r.aboutMainTitle)}>
                  <h4>3 Больших шоурма</h4>
                  <div className={cn(s.liener, r.liener)}></div>
                  <p>Эксклюзивная материалотека. Опытные дизайнеры. <br /> Удобное расположение.</p>
                </div>
              </AboutItem>
              <AboutItem index={3}>
                <div className={cn(s.aboutMainTitle, r.aboutMainTitle)}>
                  <h4>250 + интерьеров год</h4>
                  <div className={cn(s.liener, r.liener)}></div>
                  <p>Ежегодно реализуем более 250 уникальных <br /> мебельных проектов любой сложности.</p>
                </div>
              </AboutItem>
            </>
          )}

          {type === 'cooperation' && (
            <>
              <AboutItemCooperation index={0}>
                <div className={cn(s.coopIconWrapper, r.coopIconWrapper)}>
                  <img src={iconCoop1.src} alt="Забота о репутации" className={cn(s.coopIcon, r.coopIcon)} />
                </div>
                <div className={cn(s.coopDivider, r.coopDivider)}></div>
                <div className={cn(s.aboutMainTitle, r.aboutMainTitle)}>
                  <h4 className={s.coopCardTitle}>
                    ЗАБОТА О РЕПУТАЦИИ
                  </h4>
                  <p>
                    Ваша репутация — наш главный приоритет. Мы бережно воплощаем ваши проекты, чтобы каждый деталь укрепляла доверие ваших клиентов к вам.
                  </p>
                </div>
              </AboutItemCooperation>
              <AboutItemCooperation index={1}>
                <div className={cn(s.coopIconWrapper, r.coopIconWrapper)}>
                  <img src={iconCoop2.src} alt="Реализация объектов" className={cn(s.coopIcon, r.coopIcon)} />
                </div>
                <div className={cn(s.coopDivider, r.coopDivider)}></div>
                <div className={cn(s.aboutMainTitle, r.aboutMainTitle)}>
                  <h4 className={s.coopCardTitle}>
                    РЕАЛИЗАЦИЯ ОБЪЕКТОВ
                  </h4>
                  <p>
                    От смелой концепции до идеальной посадки. Мы берем на себя полную техническую ответственность за реализацию.
                  </p>
                </div>
              </AboutItemCooperation>
              <AboutItemCooperation index={2}>
                <div className={cn(s.coopIconWrapper, r.coopIconWrapper)}>
                  <img src={iconCoop3.src} alt="Многолетний опыт" className={cn(s.coopIcon, r.coopIcon)} />
                </div>
                <div className={cn(s.coopDivider, r.coopDivider)}></div>
                <div className={cn(s.aboutMainTitle, r.aboutMainTitle)}>
                  <h4 className={s.coopCardTitle}>
                    МНОГОЛЕТНИЙ ОПЫТ
                  </h4>
                  <p>
                    Более 10 лет создаём сложные проекты. Наш опыт это ваша гарантия безупречного исполнения, конструктивной прочности каждого изделия.
                  </p>
                </div>
              </AboutItemCooperation>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default About