import React from 'react'
import { getImageProps } from 'next/image'
import s from './bgBottom.module.css'
import bgFooter from '@/../public/bg-bottom-v3.webp'
import bgFooterMini from '@/../public/bg-bottom-mini-v2.webp'

export default function BgBottom() {
  const { props: { srcSet: desktopSrcSet, ...desktopProps } } = getImageProps({
    alt: "",
    src: bgFooter,
    width: bgFooter.width,
    height: bgFooter.height,
  });

  const { props: { srcSet: mobileSrcSet } } = getImageProps({
    alt: "",
    src: bgFooterMini,
    width: bgFooterMini.width,
    height: bgFooterMini.height,
  });

  return (
    <section className={s.bgButton}>
      <picture>
        <source media="(max-width: 768px)" srcSet={mobileSrcSet} />
        <source media="(min-width: 769px)" srcSet={desktopSrcSet} />
        <img
          {...desktopProps}
          alt=""
          className="w-full h-auto block"
        />
      </picture>
    </section>
  )
}
