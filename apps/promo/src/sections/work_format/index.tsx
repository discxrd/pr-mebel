import React from 'react';
import s from './work_format.module.css';
import r from './responsive.module.css';
import Image from 'next/image';
import workFormatImg from '@/../public/work-format.png';
import workFormatImgCoop from '@/../public/work_format_coop.png';
import { AnimatedTitle } from '@/components/animated-title';
import { cn } from '@/lib/utils';

const workFormats = [
  {
    title: 'По проекту дизайнера',
    description: 'Вы предоставляете готовые чертежи и визуализации. Мы берём на себя техническое проектирование, подбор материалов и безупречное изготовление. Идеально для детально проработанных концепций.'
  },
  {
    title: 'ПоД КЛЮЧ С АВТОРСКИМ СОПРОВОЖДЕНИЕМ',
    description: 'Полный цикл от идеи до установки. Наш технический специалист становится частью вашей команды: участвует в обсуждении проекта, предлагает инженерные решения и контролирует производство. Ваш идеальный баланс творчества и надёжности.'
  },
  {
    title: 'WHITE LABEL',
    description: 'Полная конфиденциальность. Мы — ваша мастерская «за кулисами». Вся мебель поставляется без наших опознавательных знаков. Ваш клиент видит только вас и безупречный результат.'
  }
];

export default function WorkFormat({ type = 'main' }: { type?: string }) {
  return (
    <section className={cn(s.section, r.section)}>
      <div className={cn(s.workFormatWrapper, r.workFormatWrapper)}>
        <div className={cn(s.leftList, r.leftList)}>
          <AnimatedTitle as="h2" className={cn(type === 'cooperation' && s.h2CoopNoPadding)}>ВЫБИРАЙТЕ ФОРМАТ РАБОТЫ</AnimatedTitle>
          {workFormats.map((format, index) => (
            <div key={index} className={cn(s.listItem, r.listItem)}>
              <div className={cn(s.itemHeader, r.itemHeader)}>
                <div className={cn(s.number, r.number)}>{index + 1}/</div>
                <h3 className={cn(s.title, r.title)}>{format.title.toUpperCase()}</h3>
              </div>
              <p className={cn(s.description, r.description)}>{format.description}</p>
            </div>
          ))}
        </div>
        <div className={cn(s.rightImage, r.rightImage)}>
          <Image 
            src={type === 'cooperation' ? workFormatImgCoop : workFormatImg} 
            alt="Форматы работы"
            fill
            style={{ objectFit: 'cover' }}
            className={cn(s.mainImage, r.mainImage)}
          />
        </div>
      </div>
    </section>
  );
}