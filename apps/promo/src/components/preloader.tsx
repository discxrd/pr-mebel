"use client";

import React, { useEffect, useState } from "react";
import { config } from "@/variables";

export const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!config.enablePreloader) {
      setLoading(false);
      setShouldRender(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShouldRender(false), 500); // Wait for transition fade out
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  if (!config?.enablePreloader || !shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#1f1e1a] transition-opacity duration-500 ease-in-out ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-16 w-16">
          {/* Inner static border */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          {/* Rotating active arc */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent" />
        </div>
        <span className="text-[12px] font-light uppercase tracking-[0.2em] text-white animate-pulse">
          Загрузка
        </span>
      </div>
    </div>
  );
};
