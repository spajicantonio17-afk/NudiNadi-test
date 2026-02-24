'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useFavorites } from '@/lib/favorites';
import { useToast } from '@/components/Toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isFavorite: checkFavorite, toggleFavorite: toggle } = useFavorites();
  const { showToast } = useToast();
  const [imgError, setImgError] = useState(false);

  // Strip multiplied ID suffix (e.g. "5-12" → "5") for localStorage
  const baseId = product.id.includes('-') ? product.id.split('-')[0] : product.id;
  const isFavorite = checkFavorite(baseId);

  const handleCardClick = () => {
    router.push(`/product/${baseId}`);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(baseId);
    showToast(isFavorite ? 'Uklonjeno iz favorita' : 'Dodano u favorite');
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-[16px] overflow-hidden flex flex-col border border-gray-100 relative group active:scale-[0.98] transition-all h-[190px] w-full cursor-pointer shadow-sm hover:shadow-md hover:border-gray-200"
    >
      {/* Image Area */}
      <div className="relative h-[130px] w-full shrink-0 overflow-hidden">
        {imgError ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <i className="fa-solid fa-image text-gray-300 text-2xl"></i>
          </div>
        ) : (
          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw" className="object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgError(true)} />
        )}

        {/* Heart Icon */}
        <div className="absolute top-2 left-2 z-10">
          <button
            onClick={toggleFavorite}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              isFavorite ? 'bg-red-500/90 text-white shadow-sm' : 'bg-white/80 backdrop-blur-md text-gray-500 hover:bg-white hover:text-red-500 shadow-sm'
            }`}
          >
            <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart text-[10px]`}></i>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-2 flex flex-col justify-center overflow-hidden bg-white">
        <h3 className="text-[11px] font-bold text-gray-900 leading-tight line-clamp-1 mb-1">
          {product.name}
        </h3>

        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-medium truncate max-w-[80px]">{product.location}</span>
            <span className="text-[8px] text-gray-300">{product.timeLabel.split(' ').pop()}</span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[11px] font-extrabold text-blue-600 leading-none">&euro;{product.price.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-blue-400 leading-none">{product.secondaryPriceLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
