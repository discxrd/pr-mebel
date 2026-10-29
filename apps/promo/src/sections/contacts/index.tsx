"use client";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { number } from "@/variables";
import { DialogForm } from "../dialog-form";
import { YandexMetrikaId } from "@/scripts";
import { useEffect, useRef, useState } from "react";
import Link from 'next/link'
import s from './contacts.module.css'
import r from './responsive.module.css'
import Image from 'next/image'



import contactIntro from '@/../public/contact/contact-intro.png'
import contact1 from '@/../public/contact/contact-01.jpg'
import contact2 from '@/../public/contact/contact-02.jpg'
import contact3 from '@/../public/contact/contact-03.jpg'
import contact4 from '@/../public/contact/contact-04.png'
import contactMini1 from '@/../public/contact/contact-mini-1.png'
import contactMini2 from '@/../public/contact/contact-mini-2.png'
import contactMini3 from '@/../public/contact/contact-mini-3.png'
import contactMini4 from '@/../public/contact/contact-mini-4.png'

const LazyMap = dynamic(() => import("./map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className={cn(s.mapFallback, s.mapFallbackPulse)}>
      Загрузка карты...
    </div>
  ),
});

export const ContactsSection = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const hasSent = useRef(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsMapVisible(true);
          if (!hasSent.current && entry.intersectionRatio >= 0.5) {
            hasSent.current = true;
            if (typeof window !== "undefined" && window.ym) {
              window.ym(YandexMetrikaId, "reachGoal", `promo/menu/contacts`);
              localStorage.setItem("visited_contacts_block", "true");
            }
          }
        }
      },
      {
        rootMargin: "200px 0px",
        threshold: [0.01, 0.5],
      },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(s.contactsRoot, r.contactsRoot)}
      id="contacts"
      ref={ref}
    >
      <div className={cn(s.container, r.container)}>
        <h2 className={cn(s.titleContact, r.titleContact)}>НАШИ КОНТАКТЫ</h2>
        
        <div className={cn(s.contactsListWrapper, r.contactsListWrapper)}>
          
          {/* Card 1: Banner */}
          <div className={cn(s.contactCard, s.bannerCard, r.contactCard, r.bannerCard)}>
            <div className={cn(s.cardLeft, s.bannerLeft, r.cardLeft, r.bannerLeft)}>
              <h3>ПРИЕЗЖАЙТЕ К НАМ <span className={s.redText}>В ГОСТИ</span></h3>
              <p>Мы с удовольствием покажем весь ассортимент нашей мебели и поможем вам сделать правильный выбор</p>
            </div>
            <div className={cn(s.cardRight, r.cardRight)}>
              <Image 
                src={contactIntro} 
                alt="Приезжайте к нам в гости" 
                className={s.cardImg}
              />
            </div>
          </div>

          {/* Card 2: Salon Roomer */}
          <div className={cn(s.contactCard, s.salonCard, r.contactCard, r.salonCard)}>
            <div className={cn(s.cardLeft, r.cardLeft)}>
              <h4 className={cn(s.cardTitle, r.cardTitle)}>САЛОН «NOBIELE DESIGN»</h4>
              <div className={cn(s.cardDetailsGrid, r.cardDetailsGrid)}>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Адрес:</span>
                  <span className={s.detailValue}>
                    м. Автозаводская
                    <span className={s.metroBlock}>ТЦ "Roomer", ул. Ленинская Слобода, д. 26</span>
                  </span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>График работы:</span>
                  <span className={s.detailValue}>с 10:00 до 22:00</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Телефон:</span>
                  <Link href="tel:+74952780215" className={s.detailValueLink}>8 (495) 278-02-15</Link>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>E-mail:</span>
                  <Link href="mailto:info@nobiele.ru" className={s.detailValueLink}>info@nobiele.ru</Link>
                </div>
              </div>
            </div>
            <div className={cn(s.cardRight, r.cardRight)}>
              <Image 
                src={contact1} 
                alt="Салон NOBIELE DESIGN" 
                className={s.cardImg}
              />
            </div>
          </div>

          {/* Card 3: Salon Crocus */}
          <div className={cn(s.contactCard, s.salonCard, r.contactCard, r.salonCard)}>
            <div className={cn(s.cardLeft, r.cardLeft)}>
              <h4 className={cn(s.cardTitle, r.cardTitle)}>САЛОН «NOBIELE DESIGN»</h4>
              <div className={cn(s.cardDetailsGrid, r.cardDetailsGrid)}>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Адрес:</span>
                  <span className={s.detailValue}>
                    м. Мякинино
                    <span className={s.metroBlock}>Крокус Сити, ТЦ "Твой Дом 2", корпус «Мебель», 65-66 км МКАД</span>
                  </span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>График работы:</span>
                  <span className={s.detailValue}>с 10:00 до 22:00</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Телефон:</span>
                  <Link href="tel:+74952780235" className={s.detailValueLink}>8 (495) 278-02-35</Link>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>E-mail:</span>
                  <Link href="mailto:info@nobiele.ru" className={s.detailValueLink}>info@nobiele.ru</Link>
                </div>
              </div>
            </div>
            <div className={cn(s.cardRight, r.cardRight)}>
              <Image 
                src={contact2} 
                alt="Салон NOBIELE DESIGN" 
                className={s.cardImg}
              />
            </div>
          </div>

          {/* Card 4: Salon Baltiyskaya */}
          <div className={cn(s.contactCard, s.salonCard, r.contactCard, r.salonCard)}>
            <div className={cn(s.cardLeft, r.cardLeft)}>
              <h4 className={cn(s.cardTitle, r.cardTitle)}>САЛОН «ЧАСТНЫЙ МЕБЕЛЬЕР»</h4>
              <div className={cn(s.cardDetailsGrid, r.cardDetailsGrid)}>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Адрес:</span>
                  <span className={s.detailValue}>
                    м. Сокол
                    <span className={s.metroBlock}>Ленинградский пр-кт. д.80 корп.21</span>
                  </span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>График работы:</span>
                  <span className={s.detailValue}>с 10:00 до 20:00</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Телефон:</span>
                  <Link href="tel:+74952780285" className={s.detailValueLink}>+7 (495) 180-04-10</Link>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>E-mail:</span>
                  <Link href="mailto:info@nobiele.ru" className={s.detailValueLink}>info@nobiele.ru</Link>
                </div>
              </div>
            </div>
            <div className={cn(s.cardRight, r.cardRight)}>
              <Image 
                src={contact3} 
                alt="Салон ЧАСТНЫЙ МЕБЕЛЬЕР" 
                className={s.cardImg}
              />
            </div>
          </div>

          {/* Card 5: Central Office */}
          <div className={cn(s.contactCard, s.officeCard, r.contactCard, r.officeCard)}>
            <div className={cn(s.cardLeft, r.cardLeft)}>
              <h4 className={cn(s.cardTitle, r.cardTitle)}>ЦЕНТРАЛЬНЫЙ ОФИС</h4>
              <div className={cn(s.cardDetailsGridOffice, r.cardDetailsGridOffice)}>
                <div className={cn(s.detailItem, s.order1)}>
                  <span className={s.detailLabel}>Адрес:</span>
                  <span className={s.detailValue}>
                    м. Пражская
                    <span className={s.metroBlock}>ул. Подольских Курсантов, дом 3, стр 2, подъезд 1, этаж 3</span>
                  </span>
                </div>
                <div className={cn(s.detailItem, s.order5)}>
                  <span className={s.detailLabel}>График работы:</span>
                  <span className={s.detailValue}>с 10:00 до 22:00</span>
                </div>
                <div className={cn(s.detailItem, s.order2)}>
                  <span className={s.detailLabel}>Единая информационная служба:</span>
                  <Link href={`tel:${number.phone}`} className={s.detailValueLink}>{number.phoneMask}</Link>
                </div>
                <div className={cn(s.detailItem, s.order3)}>
                  <span className={s.detailLabel}>Служба сервиса:</span>
                  <Link href="tel:+74991643384" className={s.detailValueLink}>8 (499) 164-33-84</Link>
                </div>
                <div className={cn(s.detailItem, s.order6)}>
                  <span className={s.detailLabel}>Отдел по работе с дизайнерами:</span>
                  <Link href="tel:+74957553505" className={s.detailValueLink}>8 (495) 755-35-05</Link>
                </div>
                <div className={cn(s.detailItem, s.order7)}>
                  <span className={s.detailLabel}>Отдел по работе с корпоративными клиентами:</span>
                  <Link href="tel:+74991642300" className={s.detailValueLink}>8 (499) 164-23-00</Link>
                </div>
                <div className={cn(s.detailItem, s.order4)}>
                  <span className={s.detailLabel}>E-mail:</span>
                  <Link href="mailto:info@nobiele.ru" className={s.detailValueLink}>info@nobiele.ru</Link>
                </div>
              </div>
            </div>
            <div className={cn(s.cardRight, r.cardRight)}>
              <Image 
                src={contact4} 
                alt="Центральный офис" 
                className={s.cardImg}
              />
            </div>
          </div>

        </div>

        <div className={cn(s.mapWrapper, r.mapWrapper)}>
          {isMapVisible ? <LazyMap /> : <div className={s.mapFallback} />}
        </div>
      </div>
    </div>
  );
};