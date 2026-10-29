"use client"

import React, { useState, useEffect } from 'react'
import s from './reviews.module.css'
import r from './responsive.module.css'
import Image from 'next/image'
import arrow from '../../../public/arrow-silver.svg'
import { mockReviews } from '../../variables'
import { cn } from '@/lib/utils'
import { YandexMetrikaId } from '@/scripts'

export default function Reviews() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedReviewIds, setExpandedReviewIds] = useState<number[]>([])

  // Логика свайпа для тач-устройств
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const totalSteps = mockReviews.length

  const handlePrev = () => {
    setCurrentReviewIndex(prev => (prev === 0 ? totalSteps - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentReviewIndex(prev => (prev === totalSteps - 1 ? 0 : prev + 1))
    if (typeof window !== "undefined" && window.ym) {
      window.ym(YandexMetrikaId, "reachGoal", "click_next_review");
    }
  }

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedReviewIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }


  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i < count ? "#F2C94C" : "#E5E5E5"} xmlns="http://www.w3.org/2000/svg">
        <path d="M7 0L9.163 4.382L14 5.086L10.5 8.498L11.326 13.318L7 11.042L2.674 13.318L3.5 8.498L0 5.086L4.837 4.382L7 0Z" />
      </svg>
    ))
  }

  const translateValue = `calc(-${currentReviewIndex} * (var(--card-width) + var(--card-gap)))`

  return (
    <section id="reviews" className={cn(s.section, r.section)}>
      <div className={cn(s.sectionWrapper, r.sectionWrapper)}>
        <div className="relative">
          <h2 className={cn(s.heading, r.heading)}>НАС РЕКОМЕНДУЮТ</h2>

          <div
            className={cn(s.sliderContainer, r.sliderContainer)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className={cn(s.sliderTrack, r.sliderTrack)}
              style={{ transform: `translateX(${translateValue})` }}
            >
              {mockReviews.map((review) => {
                const isExpanded = expandedReviewIds.includes(review.id)

                return (
                  <div key={review.id} className={cn(s.slideItem, r.slideItem)}>
                    <div className={cn(s.textCard, r.textCard)}>
                      <div className={cn(s.cardHeader, r.cardHeader)}>
                        <div className={cn(s.userInfo, r.userInfo)}>
                          <div>
                            <div className={cn(s.userName, r.userName)}>{review.name}</div>
                            <div className={cn(s.userDate, r.userDate)}>{review.date}</div>
                          </div>
                        </div>
                        <div className={cn(s.stars, r.stars)}>
                          {renderStars(review.stars || 5)}
                        </div>
                      </div>

                      <h3 className={cn(s.cardTitle, r.cardTitle)}>{review.title}</h3>
                      <div
                        className={cn(s.cardText, r.cardText, isExpanded && s.cardTextExpanded)}
                        onWheel={(e) => {
                          if (isExpanded) {
                            e.stopPropagation()
                          }
                        }}
                      >
                        <p className={s.initialText}>
                          <span className={cn(s.desktopText, r.desktopText)}>
                            {isExpanded ? review.textFull : review.text}
                          </span>
                          <span className={cn(s.mobileText, r.mobileText)}>
                            {review.textFull}
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        className={cn(s.readMoreBtn, r.readMoreBtn)}
                        onClick={(e) => toggleExpand(review.id, e)}
                      >
                        {isExpanded ? 'Свернуть' : 'Прочитать весь'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={cn(s.controls, r.controls)}>
            <button onClick={handlePrev} className={cn(s.navBtn, r.navBtn)}>
              <Image src={arrow} alt="arrow" width={32} height={32} />
            </button>

            <span className={cn(s.pagination, r.pagination)}>
              {String(currentReviewIndex + 1).padStart(2, '0')}
            </span>

            <button onClick={handleNext} className={cn(s.navBtn, r.navBtn)} style={{ rotate: "180deg" }}>
              <Image src={arrow} alt="arrow" width={32} height={32} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}