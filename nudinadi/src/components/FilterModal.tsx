'use client';

import React, { useState, useEffect } from 'react';

// ── Filter State Types ───────────────────────────────────────────

export interface FilterState {
  priceMin: string;
  priceMax: string;
  condition: string;
  sortBy: string;
  timePosted: string;
  delivery: string;
  sellerType: string;
  radiusKm: number;
}

export const DEFAULT_FILTERS: FilterState = {
  priceMin: '',
  priceMax: '',
  condition: 'all',
  sortBy: 'newest',
  timePosted: 'all',
  delivery: 'all',
  sellerType: 'all',
  radiusKm: 0,
};

function countActiveFilters(f: FilterState): number {
  let count = 0;
  if (f.priceMin) count++;
  if (f.priceMax) count++;
  if (f.condition !== 'all') count++;
  if (f.sortBy !== 'newest') count++;
  if (f.timePosted !== 'all') count++;
  if (f.delivery !== 'all') count++;
  if (f.sellerType !== 'all') count++;
  if (f.radiusKm > 0) count++;
  return count;
}

// ── Reusable pill-button group ───────────────────────────────────

function PillGroup<T extends string>({
  options,
  value,
  onChange,
  activeClass,
}: {
  options: { value: T; label: string; icon: string }[];
  value: T;
  onChange: (v: T) => void;
  activeClass: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[11px] font-semibold transition-all active:scale-95 border ${
            value === opt.value
              ? activeClass
              : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <i className={`fa-solid ${opt.icon} text-[10px]`}></i>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Section card ─────────────────────────────────────────────────

function Section({
  icon,
  label,
  accent,
  children,
}: {
  icon: string;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-[16px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-6 h-6 rounded-[8px] ${accent} flex items-center justify-center`}>
          <i className={`fa-solid ${icon} text-white text-[10px]`}></i>
        </div>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
      {children}
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────────

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
  locationName: string | null;
  onLocationClick: () => void;
  onDetectGPS: () => void;
  isDetectingGPS: boolean;
}

// ── Component ────────────────────────────────────────────────────

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  locationName,
  onLocationClick,
  onDetectGPS,
  isDetectingGPS,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    if (isOpen) setFilters(currentFilters);
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => setFilters(DEFAULT_FILTERS);

  const activeCount = countActiveFilters(filters);

  if (!isOpen) return null;

  // Radius percentage for the track fill
  const radiusPct = (filters.radiusKm / 200) * 100;

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pt-24 pb-4 px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white border border-gray-200 w-full max-w-2xl rounded-[28px] shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out] max-h-[calc(100vh-7rem)] flex flex-col">

        {/* Decorative glow */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-50 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-[60px] pointer-events-none" />

        {/* ── Header ── */}
        <div className="relative z-10 shrink-0 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <i className="fa-solid fa-sliders text-white text-sm"></i>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">Filteri</h2>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">
                {activeCount > 0 ? `${activeCount} aktivan filter${activeCount > 1 ? 'a' : ''}` : 'Prilagodi pretragu'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-500 text-[10px] font-bold hover:bg-red-100 transition-colors"
              >
                <i className="fa-solid fa-rotate-left text-[9px]"></i> Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="relative z-10 overflow-y-auto flex-1 p-5 space-y-3">

          {/* ROW 1: Location + Radius side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* Location */}
            <Section icon="fa-location-dot" label="Lokacija" accent="bg-blue-500">
              <div className="flex gap-2">
                <button
                  onClick={onLocationClick}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-[12px] text-[12px] font-semibold text-gray-700 hover:border-blue-300 transition-all"
                >
                  <i className="fa-solid fa-map-marker-alt text-blue-500 text-[11px] shrink-0"></i>
                  <span className="truncate">{locationName || 'Sve Lokacije'}</span>
                  <i className="fa-solid fa-chevron-right text-[8px] text-gray-300 ml-auto shrink-0"></i>
                </button>
                <button
                  onClick={onDetectGPS}
                  disabled={isDetectingGPS}
                  title="Otkrij moju lokaciju"
                  className="w-11 h-11 bg-white border border-gray-200 rounded-[12px] flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:border-blue-300 transition-all disabled:opacity-50 shrink-0"
                >
                  <i className={`fa-solid fa-crosshairs text-sm ${isDetectingGPS ? 'animate-spin' : ''}`}></i>
                </button>
              </div>
            </Section>

            {/* Radius */}
            <Section icon="fa-bullseye" label="Radius pretrage" accent="bg-purple-500">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Udaljenost</span>
                  <span className="text-[13px] font-black text-gray-800">
                    {filters.radiusKm === 0 ? 'Neograničeno' : `${filters.radiusKm} km`}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                      style={{ width: `${radiusPct}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0" max="200" step="5"
                    value={filters.radiusKm}
                    onChange={(e) => setFilters({ ...filters, radiusKm: Number(e.target.value) })}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
                  />
                </div>
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>0</span><span>50</span><span>100</span><span>150</span><span>200 km</span>
                </div>
              </div>
            </Section>
          </div>

          {/* ROW 2: Price Range (full width) */}
          <Section icon="fa-euro-sign" label="Raspon Cijena" accent="bg-green-500">
            <div className="flex gap-3 items-center mb-3">
              <div className="flex-1 bg-white border border-gray-200 rounded-[12px] px-3 py-2 focus-within:border-green-400 transition-colors">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Min €</p>
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                  placeholder="0"
                  className="w-full bg-transparent text-[15px] font-bold text-gray-800 placeholder:text-gray-300 outline-none"
                />
              </div>
              <div className="text-gray-300 font-bold text-lg shrink-0">—</div>
              <div className="flex-1 bg-white border border-gray-200 rounded-[12px] px-3 py-2 focus-within:border-green-400 transition-colors">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Max €</p>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                  placeholder="∞"
                  className="w-full bg-transparent text-[15px] font-bold text-gray-800 placeholder:text-gray-300 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { label: 'do 50€', max: '50' },
                { label: 'do 100€', max: '100' },
                { label: 'do 500€', max: '500' },
                { label: 'do 1.000€', max: '1000' },
                { label: 'do 5.000€', max: '5000' },
              ].map((v) => (
                <button
                  key={v.max}
                  onClick={() => setFilters({ ...filters, priceMax: v.max })}
                  className={`flex-1 py-1.5 rounded-[8px] text-[9px] font-bold transition-all active:scale-95 border ${
                    filters.priceMax === v.max
                      ? 'text-green-600 border-green-400 bg-green-50'
                      : 'text-gray-400 border-gray-200 hover:text-green-600 hover:border-green-300'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </Section>

          {/* ROW 3: Condition + Sort 2-column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Section icon="fa-tag" label="Stanje artikla" accent="bg-orange-500">
              <PillGroup
                options={[
                  { value: 'all', label: 'Sve', icon: 'fa-layer-group' },
                  { value: 'new', label: 'Novo', icon: 'fa-sparkles' },
                  { value: 'like_new', label: 'Kao novo', icon: 'fa-star' },
                  { value: 'used', label: 'Korišteno', icon: 'fa-recycle' },
                ]}
                value={filters.condition}
                onChange={(v) => setFilters({ ...filters, condition: v })}
                activeClass="bg-orange-50 text-orange-600 border-orange-300"
              />
            </Section>

            <Section icon="fa-arrow-up-wide-short" label="Sortiranje" accent="bg-cyan-500">
              <PillGroup
                options={[
                  { value: 'newest', label: 'Najnovije', icon: 'fa-clock' },
                  { value: 'price_asc', label: 'Cijena ↑', icon: 'fa-arrow-up-1-9' },
                  { value: 'price_desc', label: 'Cijena ↓', icon: 'fa-arrow-down-9-1' },
                  { value: 'popular', label: 'Popularno', icon: 'fa-fire' },
                ]}
                value={filters.sortBy}
                onChange={(v) => setFilters({ ...filters, sortBy: v })}
                activeClass="bg-cyan-50 text-cyan-600 border-cyan-300"
              />
            </Section>
          </div>

          {/* ROW 4: Delivery + Seller Type 2-column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Section icon="fa-truck" label="Dostava" accent="bg-emerald-500">
              <PillGroup
                options={[
                  { value: 'all', label: 'Sve', icon: 'fa-layer-group' },
                  { value: 'shipping', label: 'Dostava', icon: 'fa-truck-fast' },
                  { value: 'pickup', label: 'Preuzimanje', icon: 'fa-hand' },
                ]}
                value={filters.delivery}
                onChange={(v) => setFilters({ ...filters, delivery: v })}
                activeClass="bg-emerald-50 text-emerald-600 border-emerald-300"
              />
            </Section>

            <Section icon="fa-user-check" label="Vrsta prodavca" accent="bg-pink-500">
              <PillGroup
                options={[
                  { value: 'all', label: 'Svi', icon: 'fa-users' },
                  { value: 'verified', label: 'Verificiran', icon: 'fa-circle-check' },
                  { value: 'premium', label: 'Premium', icon: 'fa-crown' },
                ]}
                value={filters.sellerType}
                onChange={(v) => setFilters({ ...filters, sellerType: v })}
                activeClass="bg-pink-50 text-pink-600 border-pink-300"
              />
            </Section>
          </div>

          {/* ROW 5: Time Posted (full width) */}
          <Section icon="fa-calendar" label="Vrijeme objave" accent="bg-yellow-500">
            <PillGroup
              options={[
                { value: 'all', label: 'Sve', icon: 'fa-infinity' },
                { value: 'today', label: 'Danas', icon: 'fa-sun' },
                { value: 'week', label: 'Ovaj tjedan', icon: 'fa-calendar-week' },
                { value: 'month', label: 'Ovaj mjesec', icon: 'fa-calendar' },
              ]}
              value={filters.timePosted}
              onChange={(v) => setFilters({ ...filters, timePosted: v })}
              activeClass="bg-yellow-50 text-yellow-600 border-yellow-300"
            />
          </Section>

          <div className="h-1" />
        </div>

        {/* ── Footer ── */}
        <div className="relative z-10 shrink-0 px-5 py-4 border-t border-gray-100 bg-white flex gap-3">
          <button
            onClick={handleReset}
            className="px-5 py-3.5 rounded-[14px] bg-gray-100 border border-gray-200 text-gray-600 font-bold text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-colors active:scale-95 flex items-center gap-2"
          >
            <i className="fa-solid fa-rotate-left text-[10px]"></i> Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3.5 rounded-[14px] blue-gradient text-white font-black text-[12px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-check text-[11px]"></i>
            Primijeni{activeCount > 0 ? ` (${activeCount})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
