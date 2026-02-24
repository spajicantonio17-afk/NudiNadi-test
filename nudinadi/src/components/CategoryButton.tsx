'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/types';
import { CATEGORY_IMAGES } from '@/lib/constants';

interface CategoryButtonProps {
  cat: Category;
  isActive: boolean;
  onClick: () => void;
  flexible?: boolean;
}

export default function CategoryButton({ cat, isActive, onClick, flexible }: CategoryButtonProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClass = flexible
    ? 'flex-1 min-w-0 h-[72px] rounded-[12px]'
    : 'min-w-[75px] h-[90px] rounded-[16px] shrink-0';

  return (
    <button
      onClick={onClick}
      className={`${sizeClass} border relative overflow-hidden group transition-all duration-300 ${
        isActive
          ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105 z-10 shadow-md'
          : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Background Image or Gradient Fallback */}
      {!imgError && CATEGORY_IMAGES[cat.id] ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CATEGORY_IMAGES[cat.id]}
            alt={cat.name}
            onError={() => setImgError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
              isActive ? 'scale-110 blur-[1px]' : 'group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0'
            }`}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-gray-50 dark:from-blue-900 dark:via-slate-900 dark:to-slate-800" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      {/* Icon (always visible when no image, hover-only when image present) */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
        imgError ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <div className={`${flexible ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center`}>
          <i className={`fa-solid ${cat.icon} text-white/90 ${flexible ? 'text-[10px]' : 'text-sm'}`}></i>
        </div>
      </div>

      {/* Label */}
      <div className={`absolute bottom-0 inset-x-0 ${flexible ? 'p-1.5' : 'p-2'} flex flex-col items-center justify-end h-full text-center`}>
        <span className={`${flexible ? 'text-[7px]' : 'text-[9px]'} font-bold uppercase leading-tight transition-colors ${isActive ? 'text-blue-300' : 'text-white'}`}>
          {cat.name}
        </span>
        {isActive && (
          <div className="w-1 h-1 bg-blue-400 rounded-full mt-0.5"></div>
        )}
      </div>
    </button>
  );
}
