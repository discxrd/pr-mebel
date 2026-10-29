import React from 'react'
import Link from 'next/link'
import s from './page.module.css'
import r from './responsive.module.css'
import { cn } from '@/lib/utils'
import { Header } from '@/sections/header'
import hero_img from '@/../public/cooperation-hero-v2.webp'
import { Hero } from '@/sections/hero'
import About from '@/sections/about'
import WhyAreWe from '@/sections/why-are-we'
import svg_1 from '@/../public/production/number1.svg'
import svg_2 from '@/../public/production/number2-yellow.svg'
import svg_3 from '@/../public/production/number3.svg'
import svg_4 from '@/../public/production/number4.svg'
import svg_5 from '@/../public/production/number5.svg'
import WorkFormat from '@/sections/work_format'
import { ExamplesSection } from '@/sections/examples'
import QA from '@/sections/qa'
import FormWithFile from '@/sections/formDefault'
import BgBottom from '@/sections/bg-bottom'
import { ContactsSection } from '@/sections/contacts'
import { Footer } from '@/sections/footer'
import bgImage from "@/../public/forms/bg-form.webp";
import Productions from '@/sections/productions'
import img_hero_mini from '@/../public/hero_coop_mini.png'

const accordionItems = [
  {
    number: '01',
    title: 'Какой минимальный бюджет проекта вы рассматриваете?',
    description: 'Мы ориентированы на комплексные проекты. Минимальный порог входа обсуждается индивидуально, но мы всегда открыты к диалогу. '
  },
  {
    number: '02',
    title: 'Предоставляете ли вы шаблоны для корректного оформления ТЗ?',
    description: 'Создаем детальный проект с учетом ваших предпочтений и технических требований.'
  },
  {
    number: '03',
    title: 'Возможен ли выезд вашего специалиста на сложный объект для консультации до подписания договора?',
    description: 'Производим мебель по индивидуальным размерам с использованием качественных материалов.'
  },
  {
    number: '04',
    title: 'Работаете ли вы по 100% предоплате?',
    description: 'Профессионально устанавливаем мебель и проводим финальную проверку качества.'
  },

]



const ArrowDubl = ({ className, fill = "currentColor" }: { className?: string; fill?: string }) => (
  <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M2.98204 3.5L0 6.41673L0.596323 7L3.87652 3.79163C3.95559 3.71428 4 3.60938 4 3.5C4 3.39062 3.95559 3.28572 3.87652 3.20837L0.596323 0L0 0.583264L2.98204 3.5Z" fill={fill} />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.98204 3.5L3 6.41673L3.59632 7L6.87652 3.79163C6.95559 3.71428 7 3.60938 7 3.5C7 3.39062 6.95559 3.28572 6.87652 3.20837L3.59632 0L3 0.583264L5.98204 3.5Z" fill={fill} />
  </svg>
);
export default function CooperationPage() {
  return (
    <main>
      <Header />
      <div className={cn(s.breadcrumbsContainer, r.breadcrumbsContainer)}>
        <div className={cn(s.breadcrumbs, r.breadcrumbs)}>
          <Link href="/" className={cn(s.link, r.link)}>
            Главная страница
          </Link>
          <span className={cn(s.separator, r.separator)}>
            <ArrowDubl className="mx-1" fill="currentColor" />
          </span>
          <Link href="/#projects" className={cn(s.link, r.link)}>
            Проекты
          </Link>
          <span className={cn(s.separator, r.separator)}>
            <ArrowDubl className="mx-1" fill="currentColor" />
          </span>
          <span className={cn(s.active, r.active)}>
            Сотрудничество
          </span>
        </div>
      </div>
      <Hero type="cooperation" image={hero_img.src} imageMobile={img_hero_mini}/>
      <About type="cooperation" text='Ваш надежный партнер в создании эксклюзивных интерьеров. Доверьте нам реализацию  проектов — сосредоточьтесь на творчестве, а мы обеспечим безупречное качество и сроки.' />

      <Productions type="cooperation" />
      <WorkFormat type="cooperation" />
      <ExamplesSection title="Наши проекты" />
      <QA items={accordionItems} title="Вопрос-ответ для партнёров" />


      <FormWithFile
        title="ДЛЯ ТОГО, ЧТОБЫ НАЧАТЬ СОТРУДНИЧЕСТВО С НАМИ, ЗАПОЛНИТЕ ФОРМУ"
        type="main"
        subtitle="Отправьте его нам, и мы подготовим для Вас персональное предложение"
        file={true}
        bgImage={bgImage}
        btnText="получить предложение"
      />

      <ContactsSection />
      <BgBottom />
      <Footer />
    </main>
  )
}
