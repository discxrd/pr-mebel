"use client";
import {
  Map as YMap,
  Placemark,
  YMaps as YMapsProvider,
} from "@pbe/react-yandex-maps";

export const Map = () => (
  <YMapsProvider
    query={{
      apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
    }}
  >
    <YMap
      width="100%"
      height="100%"
      defaultState={{
        center: [55.737285, 37.542230],
        zoom: 10,
        behaviors: ["drag", "dblClickZoom", "multiTouch"],
        controls: [
          "zoomControl",
          "fullscreenControl",
          "geolocationControl",
          "trafficControl",
          "typeSelector",
        ],
      }}
      modules={[
        "control.ZoomControl",
        "control.FullscreenControl",
        "control.GeolocationControl",
        "control.TrafficControl",
        "control.TypeSelector",
      ]}
    >
      {/* 1. САЛОН «NOBIELE DESIGN» (Roomer) */}
      <Placemark
        defaultGeometry={[55.709927, 37.653155]}
        properties={{
          balloonContentHeader: "САЛОН «NOBIELE DESIGN»",
          balloonContentBody: "ТЦ 'Roomer', ул. Ленинская Слобода, д. 26",
          hintContent: "САЛОН «NOBIELE DESIGN»",
        }}
        options={{
          iconColor: "#E30613",
        }}
      />

      {/* 2. второй САЛОН «NOBIELE DESIGN» (Крокус) */}
      <Placemark
        defaultGeometry={[55.817240, 37.387855]}
        properties={{
          balloonContentHeader: "САЛОН «NOBIELE DESIGN» (Крокус Сити)",
          balloonContentBody: "Крокус Сити, ТЦ 'Твой Дом 2', корпус 'Мебель', 65-66 км МКАД",
          hintContent: "САЛОН «NOBIELE DESIGN» (Крокус)",
        }}
        options={{
          iconColor: "#E30613",
        }}
      />

      {/* 3. САЛОН «ЧАСТНЫЙ МЕБЕЛЬЕР» (Балтийская) */}
      <Placemark
        defaultGeometry={[55.808838, 37.512789]}
        properties={{
          balloonContentHeader: "САЛОН «ЧАСТНЫЙ МЕБЕЛЬЕР»",
          balloonContentBody: "Ленинградский пр-кт. д.80 корп.21",
          hintContent: "САЛОН «ЧАСТНЫЙ МЕБЕЛЬЕР»",
        }}
        options={{
          iconColor: "#E30613",
        }}
      />

      {/* 4. ЦЕНТРАЛЬНЫЙ ОФИС (Подольских Курсантов) */}
      <Placemark
        defaultGeometry={[55.613138, 37.615120]}
        properties={{
          balloonContentHeader: "ЦЕНТРАЛЬНЫЙ ОФИС",
          balloonContentBody: "м. Пражская, ул. Подольских Курсантов, дом 3, стр 2, подъезд 1, этаж 3",
          hintContent: "ЦЕНТРАЛЬНЫЙ ОФИС",
        }}
        options={{
          iconColor: "#E30613",
        }}
      />
    </YMap>
  </YMapsProvider>
);