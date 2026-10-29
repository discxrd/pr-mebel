"use client";

import React, { useState, useEffect, useRef } from 'react'
import s from './productions.module.css'
import r from './responsive.module.css'
import Image from 'next/image'
import { AnimatedTitle } from '@/components/animated-title'
import { cn } from '@/lib/utils'

import svg_1 from '../../../public/production/number1.svg'
import svg_2 from '../../../public/production/number2.svg'
import svg_3 from '../../../public/production/number3.svg'
import svg_3_yellow from '../../../public/production/number3-yellow.svg'
import svg_4 from '../../../public/production/number4.svg'

import img_1 from '../../../public/production/prod-bg-1.png'
import img_2 from '../../../public/production/prod-bg-2.png'
import img_3 from '../../../public/production/prod-bg-3.png'

import img_coop from '../../../public/production/prodaction-v2.png'
import { DialogForm } from '../dialog-form'
import svg_5 from '../../../public/production/number5.svg'
import svg_5_yellow from '../../../public/production/number5-yellow.svg'
import svg_6 from '../../../public/production/number6.svg'

const cardData = [
  { id: 1, icon: svg_1, title: 'Опытное <br /> конструкторское бюро', description: 'Реализуем проекты любой сложности, аккуратно переводя авторские идеи в безупречно работающие конструкторские решения.' },
  { id: 2, icon: svg_2, title: 'Собственная <br /> лаборатория цвета', description: 'Эксклюзивные отделки и индивидуальные оттенки, точно соответствующие вашему дизайн‑проекту ' },
  { id: 3, icon: svg_3, title: 'Современное европейское <br /> оборудование', description: 'Абсолютная точность. Минимальные допуски. Безупречный результат. ' },
  { id: 4, icon: svg_4, title: 'Наше производство <br /> находится в Москве', description: 'Наше производство находится в Москве. Быстро и незаметно решаем даже самые сложные вопросы.' }
];

const backgroundImageData = [
  { id: 1, image: img_1, alt: 'img_1' },
  { id: 2, image: img_3, alt: 'img_2' },
  { id: 3, image: img_2, alt: 'img_3' }
];

const AnimatedElement = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
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
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const AnimatedProductionCard = ({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index: number;
}) => {
  return (
    <AnimatedElement className={className} delay={(index % 4) * 150}>
      {children}
    </AnimatedElement>
  );
};

export default function Productions({ type = 'main' }: { type?: string }) {
  if (type === 'cooperation') {
    return (
      <section className={cn(s.section, r.section)} id='productions'>
        <div className={cn(s.scectionWrapper, r.scectionWrapper)}>
          <div className={cn(s.gridContainer, r.gridContainer, s.gridContainerCooperation, r.gridContainerCooperation)}>

            {/* --- КОЛОНКА 1 (588px) --- */}
            <div className={cn(s.textBlock, r.textBlock)}>
              <AnimatedTitle as="h2">ВЫГОДЫ СОТРУДНИЧЕСТВА С НАМИ</AnimatedTitle>
              <AnimatedTitle as="p">Вы создаете концепцию, мы воплощаем ее в материале с ювелирной точностью. Наше производство — это ваша надежная мастерская для реализации проектов любого масштаба и сложности</AnimatedTitle>
              <div className={cn(s.coopBtnContainer, r.coopBtnContainer)}>
                <DialogForm
                  title="Стать партнёром"
                  description="Оставьте Ваши контактные данные, и мы свяжемся с Вами в ближайшее время."
                  submitText="Отправить заявку"
                  formName="Блок : ВЫГОДЫ СОТРУДНИЧЕСТВА С НАМИ: СТАТЬ ПАРТНЁРОМ"
                >
                  <button className={cn(s.submitBtn, r.submitBtn)}>СТАТЬ ПАРТНЁРОМ</button>
                </DialogForm>
              </div>
            </div>

            <AnimatedElement className={cn(s.mainImage, r.mainImage)} delay={150}>
              <Image
                src={img_coop}
                alt="Выгоды сотрудничества"
                fill
                sizes="(max-width: 1024px) 100vw, 588px"
                style={{ objectFit: 'cover' }}
              />
            </AnimatedElement>

            {/* --- КОЛОНКА 2 (467px) --- */}
            <AnimatedProductionCard className={cn(s.card, r.card, s.darkCard, r.darkCard, s.card1, r.card1, s.coopCard, r.coopCard)} index={0}>
              <div className={cn(s.icon, r.icon)}>
                <Image src={svg_1} alt="icon 1" width={40} height={40} />
              </div>
              <div className={cn(s.content, r.content)}>
                <h3>РЕАЛИЗАЦИЯ <br /> ЛЮБЫХ ИДЕЙ</h3>
                <div className={cn(s.liener, r.liener)}></div>
                <p>Сложный радиус, встроенная техника, уникальный декор — наши технологи найдут решение для любой вашей задумки</p>
              </div>
            </AnimatedProductionCard>

            <AnimatedProductionCard className={cn(s.card, r.card, s.whiteCard, r.whiteCard, s.card2, r.card2, s.coopCard, r.coopCard)} index={1}>
              <div className={cn(s.icon, r.icon)}>
                <Image src={svg_2} alt="icon 2" width={40} height={40} />
              </div>
              <div className={cn(s.content, r.content)}>
                <h3>ЭКОНОМИЯ <br /> ВРЕМЕНИ</h3>
                <div className={cn(s.liener, r.liener)}></div>
                <p>Персональный менеджер берет на себя все коммуникации по проекту, вы получаете единое окно для решения любых вопросов</p>
              </div>
            </AnimatedProductionCard>

            <AnimatedProductionCard className={cn(s.card, r.card, s.darkCard, r.darkCard, s.card3, r.card3, s.coopCard, r.coopCard)} index={2}>
              <div className={cn(s.icon, r.icon)}>
                <Image src={svg_3_yellow} alt="icon 3" width={40} height={40} />
              </div>
              <div className={cn(s.content, r.content)}>
                <h3>ТЕХНИЧЕСКАЯ <br /> ПОДДЕРЖКА</h3>
                <div className={cn(s.liener, r.liener)}></div>
                <p>Помощь наших инженеров на этапе подготовки чертежей для идеальной «посадки» мебели, оптимизации конструкции</p>
              </div>
            </AnimatedProductionCard>

            {/* --- КОЛОНКА 3 (355px) --- */}
            <AnimatedProductionCard className={cn(s.card, r.card, s.whiteCard, r.whiteCard, s.coopCard4, r.coopCard4, s.coopCard, r.coopCard)} index={3}>
              <div className={cn(s.icon, r.icon)}>
                <Image src={svg_4} alt="icon 4" width={40} height={40} />
              </div>
              <div className={cn(s.content, r.content)}>
                <h3>ПРОЗРАЧНОСТЬ <br /> ДЛЯ ВАШЕГО КЛИЕНТА</h3>
                <div className={cn(s.liener, r.liener)}></div>
                <p>Четкие сроки, фиксированная смета, фотоотчеты с производства. Ваша репутация останется безупречной</p>
              </div>
            </AnimatedProductionCard>

            <AnimatedProductionCard className={cn(s.card, r.card, s.darkCard, r.darkCard, s.card4, r.card4, s.coopCard, r.coopCard)} index={4}>
              <div className={cn(s.icon, r.icon)}>
                <Image src={svg_5_yellow} alt="icon 5" width={40} height={40} />
              </div>
              <div className={cn(s.content, r.content)}>
                <h3>СПЕЦИАЛЬНЫЕ <br /> УСЛОВИЯ</h3>
                <div className={cn(s.liener, r.liener)}></div>
                <p>Программа лояльности и индивидуальный расчет для постоянных партнеров</p>
              </div>
            </AnimatedProductionCard>

            <AnimatedProductionCard className={cn(s.card, r.card, s.whiteCard, r.whiteCard, s.coopCard6, r.coopCard6, s.coopCard, r.coopCard)} index={5}>
              <div className={cn(s.icon, r.icon)}>
                <Image src={svg_6} alt="icon 6" width={40} height={40} />
              </div>
              <div className={cn(s.content, r.content)}>
                <h3>ПРОРАБОТКА <br /> ЧЕРТЕЖЕЙ</h3>
                <div className={cn(s.liener, r.liener)}></div>
                <p>Тщательная работа с чертежами, чтобы каждая деталь вашей мебели была идеально воплощена.<br /><br />Ваши идеи - наш приоритет, и мы гарантируем точность и качество на каждом этапе разработки.</p>
              </div>
            </AnimatedProductionCard>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn(s.section, r.section)} id='productions'>
      <div className={cn(s.scectionWrapper, r.scectionWrapper)}>
        <div className={cn(s.gridContainer, r.gridContainer)}>

          {/* --- КОЛОНКА 1 (588px) --- */}
          <div className={cn(s.textBlock, r.textBlock)}>
            <AnimatedTitle as="h2">Производство</AnimatedTitle>
            <AnimatedTitle as="p">Современные технологии производства для идеального <br /> качества вашей мебели.</AnimatedTitle>
          </div>

          <AnimatedElement className={cn(s.mainImage, r.mainImage)} delay={150}>
            <Image
              src={backgroundImageData[0].image}
              alt="Производство"
              fill
              sizes="(max-width: 1024px) 100vw, 588px"
              style={{ objectFit: 'cover' }}
            />
          </AnimatedElement>

          {/* --- КОЛОНКА 2 (467px) --- */}
          <AnimatedProductionCard className={cn(s.card, r.card, s.darkCard, r.darkCard, s.card1, r.card1)} index={0}>
            <div className={cn(s.icon, r.icon)}>
              <Image src={cardData[0].icon} alt="icon 1" width={40} height={40} />
            </div>
            <div className={cn(s.content, r.content)}>
              <h3 dangerouslySetInnerHTML={{ __html: cardData[0].title }} />
              <div className={cn(s.liener, r.liener)}></div>
              <p>{cardData[0].description}</p>
            </div>
          </AnimatedProductionCard>

          <AnimatedProductionCard className={cn(s.card, r.card, s.whiteCard, r.whiteCard, s.card2, r.card2)} index={1}>
            <div className={cn(s.icon, r.icon)}>
              <Image src={cardData[1].icon} alt="icon 2" width={40} height={40} />
            </div>
            <div className={cn(s.content, r.content)}>
              <h3 dangerouslySetInnerHTML={{ __html: cardData[1].title }} />
              <div className={cn(s.liener, r.liener)}></div>
              <p>{cardData[1].description}</p>
            </div>
          </AnimatedProductionCard>

          <AnimatedProductionCard className={cn(s.card, r.card, s.whiteCard, r.whiteCard, s.card3, r.card3)} index={2}>
            <div className={cn(s.icon, r.icon)}>
              <Image src={cardData[2].icon} alt="icon 3" width={40} height={40} />
            </div>
            <div className={cn(s.content, r.content)}>
              <h3 dangerouslySetInnerHTML={{ __html: cardData[2].title }} />
              <div className={cn(s.liener, r.liener)}></div>
              <p>{cardData[2].description}</p>
            </div>
          </AnimatedProductionCard>

          {/* --- КОЛОНКА 3 (355px) --- */}
          {/* Вложенная сетка для двух маленьких картинок */}
          <div className={cn(s.smallImagesWrapper, r.smallImagesWrapper)}>
            <AnimatedElement className={cn(s.smallImg, r.smallImg)} delay={200}>
              <Image src={backgroundImageData[1].image} alt="img2" fill sizes="177px" style={{ objectFit: 'cover' }} />
            </AnimatedElement>
            <AnimatedElement className={cn(s.smallImg, r.smallImg)} delay={300}>
              <Image src={backgroundImageData[2].image} alt="img3" fill sizes="177px" style={{ objectFit: 'cover' }} />
            </AnimatedElement>
          </div>

          <AnimatedProductionCard className={cn(s.card, r.card, s.darkCard, r.darkCard, s.card4, r.card4)} index={3}>
            <div className={cn(s.icon, r.icon)}>
              <Image src={cardData[3].icon} alt="icon 4" width={40} height={40} />
            </div>
            <div className={cn(s.content, r.content)}>
              <h3 dangerouslySetInnerHTML={{ __html: cardData[3].title }} />
              <div className={cn(s.liener, r.liener)}></div>
              <p>{cardData[3].description}</p>
            </div>
          </AnimatedProductionCard>

          <AnimatedElement className={cn(s.btnWrapper, r.btnWrapper)} delay={400}>
            <DialogForm
              title="Остались вопросы?"
              description="Оставьте Ваши контактные данные, и мы свяжемся с Вами в ближайшее время."
              submitText="Задать вопрос"
              formName="Блок производства: Задать вопрос"
            >
              <button className={cn(s.submitBtn, r.submitBtn)}>Задать вопрос</button>
            </DialogForm>
          </AnimatedElement>

        </div>
      </div>
    </section>
  )
}