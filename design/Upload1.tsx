
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { CATEGORIES, CURRENT_USER } from '../constants';
import { analyzeRawInput } from '../services/geminiService';

type UploadStep = 'category-selection' | 'ai-input' | 'confirmation' | 'form-basic' | 'form-details';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<UploadStep>('category-selection');
  
  // State
  const [rawInput, setRawInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '', 
    priceType: 'fixed', // 'fixed' | 'negotiable' | 'request'
    condition: 'Korišteno', // 'Novo' | 'Kao novo' | 'Korišteno' | 'Oštećeno'
    category: '', 
    subCategory: '',
    
    // Dynamic Fields - General
    year: '',
    mileage: '',
    fuel: '',
    sqMeters: '',
    rooms: '',
    floor: '',
    heating: '',
    jobType: '',
    salaryPeriod: 'Mjesečno',

    // Dynamic Fields - Mobile/Tech
    storage: '',
    batteryHealth: '',
    os: '',
    color: '',
    hasWarranty: false,
    hasBox: false,
    hasCharger: false,
    
    // Images
    images: [] as string[]
  });

  // --- HANDLERS ---

  const handleCategorySelect = (catName: string) => {
      setFormData(prev => ({ ...prev, category: catName }));
      setStep('ai-input');
  };

  const handleAiAnalysis = async () => {
    if (!rawInput.trim()) return;
    setIsAiLoading(true);

    const result = await analyzeRawInput(rawInput);
    
    if (result) {
        setFormData(prev => ({
            ...prev,
            title: result.title || rawInput,
            description: result.description || '',
            price: result.price || '',
            condition: result.condition || 'Korišteno',
            category: result.category || prev.category,
            
            // Map Attributes
            year: result.attributes?.year || '',
            mileage: result.attributes?.mileage || '',
            fuel: result.attributes?.fuel || '',
            sqMeters: result.attributes?.sqMeters || '',
            rooms: result.attributes?.rooms || '',
            jobType: result.attributes?.jobType || '',
            
            // Mobile Specifics (AI Extracted)
            storage: result.attributes?.storage || '',
            os: result.attributes?.os || '',
            color: result.attributes?.color || ''
        }));
        setStep('confirmation');
    } else {
        setFormData(prev => ({ ...prev, title: rawInput }));
        setStep('confirmation');
    }
    setIsAiLoading(false);
  };

  const confirmCategory = (catName: string) => {
      setFormData(prev => ({ ...prev, category: catName }));
      setStep('form-basic');
  };

  const handlePublish = () => {
      setIsPublishing(true);
      setTimeout(() => {
          setIsPublishing(false);
          navigate('/home');
      }, 2000);
  };

  // Helper for Price Display in Preview
  const getPriceLabel = () => {
      if (formData.priceType === 'request') return 'Na upit';
      if (formData.priceType === 'negotiable') return `€ ${formData.price || '0'} MK`;
      return `€ ${formData.price || '0'}`;
  };

  // --- SUB-COMPONENTS ---

  const PhonePreview = () => (
    <div className="w-full h-[700px] bg-[#060E14] border-[8px] border-[#121C26] rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col">
        {/* Status Bar Mock */}
        <div className="h-6 w-full flex justify-between px-6 items-center pt-2 opacity-50">
            <span className="text-[9px] font-bold text-white">9:41</span>
            <div className="flex gap-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
        </div>

        {/* App Content Preview */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#0B1219]">
            
            {/* Image Area */}
            <div className="aspect-square bg-[#080D11] relative flex items-center justify-center border-b border-white/5">
                <i className="fa-regular fa-image text-4xl text-gray-700"></i>
                <div className="absolute top-4 left-0 bg-blue-600 text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-r-sm shadow-sm">
                    {formData.condition}
                </div>
            </div>

            {/* Info Area */}
            <div className="p-6">
                <h2 className="text-xl font-bold text-white leading-tight mb-2">
                    {formData.title || 'Naslov Artikla'}
                </h2>
                
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-400 text-[10px]">
                        <i className="fa-solid fa-location-dot text-blue-500"></i>
                        <span>{formData.location || 'Lokacija'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-[10px]">
                        <i className="fa-regular fa-clock"></i>
                        <span>Upravo sada</span>
                    </div>
                </div>

                {/* Price Box */}
                <div className="border border-white/10 rounded-sm overflow-hidden mb-6">
                    <div className="bg-[#121A21] p-4 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cijena</span>
                        <span className={`text-xl font-black tracking-tight ${formData.priceType === 'request' ? 'text-blue-400 text-lg' : 'text-white'}`}>
                            {getPriceLabel()}
                        </span>
                    </div>
                </div>
                
                {/* Specs Grid Preview (Mobile) - Sharpened */}
                {(formData.category === 'Mobilni uređaji' || formData.category === 'Mobiteli') && (
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-[#121C26] p-2 rounded-[2px] text-center border border-white/5">
                            <i className="fa-solid fa-microchip text-gray-500 text-xs mb-1"></i>
                            <span className="block text-[9px] text-white font-bold mt-1">{formData.storage || '-'}</span>
                        </div>
                        <div className="bg-[#121C26] p-2 rounded-[2px] text-center border border-white/5">
                            <i className="fa-solid fa-battery-half text-gray-500 text-xs mb-1"></i>
                            <span className="block text-[9px] text-white font-bold mt-1">{formData.batteryHealth ? `${formData.batteryHealth}%` : '-'}</span>
                        </div>
                        <div className="bg-[#121C26] p-2 rounded-[2px] text-center border border-white/5">
                            <i className="fa-solid fa-shield text-gray-500 text-xs mb-1"></i>
                            <span className="block text-[9px] text-white font-bold mt-1">{formData.hasWarranty ? 'Garancija' : 'No'}</span>
                        </div>
                    </div>
                )}

                {/* Description */}
                <div>
                    <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-l-2 border-blue-500 pl-2">Opis</h3>
                    <p className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-line">
                        {formData.description || 'Ovdje će se pojaviti opis vašeg artikla kada ga unesete u formu.'}
                    </p>
                </div>

            </div>
        </div>

        {/* Bottom Action Bar Mock */}
        <div className="h-16 bg-[#060E14] border-t border-white/10 flex items-center justify-between px-6">
            <div className="w-8 h-8 rounded-full border border-white/10"></div>
            <div className="w-32 h-10 bg-blue-600 rounded-sm"></div>
        </div>
    </div>
  );

  // --- RENDER STEPS ---

  // STEP 1: INITIAL CATEGORY SELECTION
  if (step === 'category-selection') {
      return (
        <Layout title="Novi Oglas" showSigurnost={false} headerRight={<button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white"><i className="fa-solid fa-xmark"></i></button>}>
            <div className="pt-4 pb-24 px-2 animate-[fadeIn_0.3s_ease-out]">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Izaberi Market</h1>
                    <p className="text-sm text-gray-400">Šta želiš prodati danas?</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {CATEGORIES.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.name)}
                            className="aspect-square bg-[#121C26] border border-white/5 rounded-[4px] flex flex-col items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-95 group relative overflow-hidden"
                        >
                             <div className="w-12 h-12 rounded-[4px] bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <i className={`fa-solid ${cat.icon} text-xl text-blue-400 group-hover:text-white`}></i>
                             </div>
                             <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </Layout>
      );
  }

  // STEP 2: AI INPUT
  if (step === 'ai-input') {
      return (
        <Layout title="Opis Artikla" showSigurnost={false} headerRight={<button onClick={() => setStep('category-selection')} className="text-xs font-bold text-gray-500">Nazad</button>}>
            <div className="flex flex-col h-[80vh] justify-center px-4 relative animate-[slideIn_0.3s_ease-out]">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto rounded-[8px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.3)] mb-6">
                        <i className="fa-solid fa-wand-magic-sparkles text-3xl text-white"></i>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Describe what you are selling</h1>
                    <p className="text-sm text-blue-400 font-bold uppercase tracking-widest">AI automatic category will find your stuff</p>
                </div>
                <div className="relative group w-full max-w-lg mx-auto">
                    <div className="relative bg-[#0F161E] rounded-[4px] p-2 border border-white/10">
                        <textarea 
                            value={rawInput}
                            onChange={(e) => setRawInput(e.target.value)}
                            placeholder={`npr. ${formData.category === 'Mobilni uređaji' ? 'iPhone 13 Pro Max 256GB' : 'Golf 7 2016'}`}
                            className="w-full bg-transparent text-lg font-medium text-white px-6 py-6 focus:outline-none placeholder:text-gray-600 resize-none h-32 text-center"
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAiAnalysis();
                                }
                            }}
                            autoFocus
                        />
                        <button 
                            onClick={handleAiAnalysis}
                            disabled={!rawInput.trim() || isAiLoading}
                            className="w-full py-4 rounded-[2px] bg-white text-black font-black uppercase tracking-[3px] hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 mt-2"
                        >
                            {isAiLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-arrow-right"></i>}
                            <span>Dalje</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
      );
  }

  // STEP 3: CONFIRMATION
  if (step === 'confirmation') {
      return (
        <Layout title="Potvrda" showSigurnost={false} headerRight={<button onClick={() => setStep('ai-input')} className="text-xs font-bold text-gray-500">Nazad</button>}>
            <div className="pt-4 pb-24 px-2 space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="text-center mb-6">
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Is this the correct category?</h2>
                </div>
                <div className="bg-[#121C26] border border-blue-500/30 rounded-sm p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-[4px] uppercase tracking-wider">AI Detected</div>
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-[4px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                             <i className={`fa-solid ${CATEGORIES.find(c => c.name === formData.category)?.icon || 'fa-check'} text-2xl`}></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{formData.title}</h3>
                            <p className="text-sm text-blue-400 font-bold uppercase tracking-wider">{formData.category}</p>
                        </div>
                        <button onClick={() => setStep('form-basic')} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-[2px] font-bold uppercase tracking-wider text-xs transition-colors shadow-lg shadow-blue-600/20">
                            Da, to je to <i className="fa-solid fa-check ml-1"></i>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map((cat) => (
                        <button key={cat.id} onClick={() => confirmCategory(cat.name)} className={`bg-[#121C26] border rounded-[2px] p-4 flex flex-col items-center gap-2 transition-all hover:bg-white/5 ${formData.category === cat.name ? 'border-white text-white' : 'border-white/5 text-gray-400'}`}>
                            <i className={`fa-solid ${cat.icon} text-lg`}></i>
                            <span className="text-[10px] font-bold uppercase">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </Layout>
      );
  }

  // STEP 4 & 5: SPLIT FORM (BASIC / DETAILS)
  const isBasicStep = step === 'form-basic';

  return (
    <Layout title={isBasicStep ? "Osnovno" : "Detalji"} showSigurnost={false} headerRight={<button onClick={() => setStep(isBasicStep ? 'confirmation' : 'form-basic')} className="text-xs font-bold text-gray-500">Nazad</button>}>
        <div className="flex flex-col lg:flex-row gap-8 pt-4 pb-32 animate-[fadeIn_0.3s_ease-out]">
            
            {/* --- LEFT: EDITOR FORM --- */}
            <div className="flex-1 space-y-6">
                
                {/* === BASIC INFO STEP === */}
                {isBasicStep && (
                    <div className="space-y-6 animate-[slideIn_0.2s_ease-out]">
                        {/* 1. Images */}
                        <div>
                            <div className="flex items-center justify-between mb-3 px-2">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Slike Artikla</h3>
                                <span className="text-[9px] text-gray-600">0/10</span>
                            </div>
                            <div className="flex gap-3 overflow-x-auto no-scrollbar px-2 pb-2">
                                <button className="w-24 h-24 shrink-0 rounded-[4px] bg-[#121C26] border border-dashed border-blue-500/30 flex flex-col items-center justify-center gap-2 group active:scale-95 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 text-blue-500 group-hover:text-white transition-colors">
                                        <i className="fa-solid fa-plus text-xs"></i>
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-500 group-hover:text-blue-400">Dodaj</span>
                                </button>
                                {/* Mock Preview */}
                                <div className="w-24 h-24 shrink-0 rounded-[4px] bg-[#0B151E] border border-white/5 flex items-center justify-center text-gray-700">
                                    <i className="fa-regular fa-image text-2xl"></i>
                                </div>
                            </div>
                        </div>

                        {/* 2. Article Name */}
                        <div className="px-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Naziv Artikla</label>
                            <div className="bg-[#121C26] border border-white/5 rounded-[2px] p-4 flex items-center">
                                <input 
                                    type="text" 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="npr. iPhone 13 Pro Max"
                                    className="w-full bg-transparent text-base font-bold text-white placeholder:text-gray-700 outline-none"
                                />
                            </div>
                        </div>

                        {/* 2.5 CONDITION (New) */}
                        <div className="px-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Stanje Artikla</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Novo', 'Kao novo', 'Korišteno', 'Oštećeno'].map(cond => (
                                    <button 
                                        key={cond}
                                        onClick={() => setFormData({...formData, condition: cond})}
                                        className={`py-3 rounded-[2px] border text-[10px] font-bold uppercase transition-all ${
                                            formData.condition === cond 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                            : 'bg-[#121C26] border-white/5 text-gray-500 hover:text-white'
                                        }`}
                                    >
                                        {cond}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Location */}
                        <div className="px-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Lokacija</label>
                            <div className="bg-[#121C26] border border-white/5 rounded-[2px] p-4 flex items-center gap-3">
                                <i className="fa-solid fa-location-dot text-gray-500 text-xs"></i>
                                <input 
                                    type="text" 
                                    value={formData.location} 
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    placeholder="Grad ili adresa"
                                    className="w-full bg-transparent text-sm font-bold text-white placeholder:text-gray-700 outline-none"
                                />
                            </div>
                        </div>

                        {/* 4. Price */}
                        <div className="px-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Cijena i Uvjeti</label>
                            <div className="bg-[#121C26] border border-white/5 rounded-sm overflow-hidden p-4 space-y-4">
                                <div className={`flex items-center gap-3 border-b border-white/5 pb-4 transition-opacity ${formData.priceType === 'request' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                    <span className="text-xl font-black text-white">€</span>
                                    <input 
                                        type="number" 
                                        value={formData.price} 
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        placeholder="0"
                                        className="w-full bg-transparent text-xl font-black text-white placeholder:text-gray-700 outline-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {[{ id: 'fixed', label: 'Fiksno' }, { id: 'negotiable', label: 'MK' }, { id: 'request', label: 'Na upit' }].map((opt) => (
                                        <button 
                                            key={opt.id}
                                            onClick={() => setFormData({...formData, priceType: opt.id})}
                                            className={`flex-1 py-2 rounded-[2px] text-[10px] font-bold uppercase border transition-all ${formData.priceType === opt.id ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* === DETAILS STEP === */}
                {!isBasicStep && (
                    <div className="space-y-6 animate-[slideIn_0.2s_ease-out]">
                        <h3 className="text-lg font-black text-white px-2">Još malo detalja...</h3>
                        
                        {/* 5. CATEGORY SPECIFIC: MOBILE PHONES */}
                        {(formData.category === 'Mobilni uređaji' || formData.category === 'Mobiteli') && (
                            <div className="px-2">
                                <div className="bg-[#121C26] border border-white/5 rounded-sm overflow-hidden divide-y divide-white/5">
                                    
                                    {/* Storage */}
                                    <div className="flex items-center justify-between p-4 hover:bg-white/5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Memorija (GB)</label>
                                        <div className="flex items-center justify-end w-1/2">
                                            <input type="text" placeholder="npr. 256GB" value={formData.storage} onChange={(e) => setFormData({...formData, storage: e.target.value})} className="w-full bg-transparent text-right text-sm font-bold text-white placeholder:text-gray-700 outline-none"/>
                                        </div>
                                    </div>

                                    {/* Battery */}
                                    <div className="flex items-center justify-between p-4 hover:bg-white/5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Zdravlje Baterije (%)</label>
                                        <div className="flex items-center justify-end w-1/2 gap-1">
                                            <input type="number" placeholder="100" value={formData.batteryHealth} onChange={(e) => setFormData({...formData, batteryHealth: e.target.value})} className="w-full bg-transparent text-right text-sm font-bold text-white placeholder:text-gray-700 outline-none"/>
                                            <span className="text-[10px] text-gray-600">%</span>
                                        </div>
                                    </div>

                                    {/* Color (New) */}
                                    <div className="flex items-center justify-between p-4 hover:bg-white/5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Boja</label>
                                        <div className="flex items-center justify-end w-1/2">
                                            <input type="text" placeholder="npr. Crna" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full bg-transparent text-right text-sm font-bold text-white placeholder:text-gray-700 outline-none"/>
                                        </div>
                                    </div>

                                    {/* OS */}
                                    <div className="flex items-center justify-between p-4 hover:bg-white/5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Sistem</label>
                                        <div className="flex justify-end gap-2">
                                            {['iOS', 'Android'].map(sys => (
                                                <button key={sys} onClick={() => setFormData({...formData, os: sys})} className={`text-[10px] font-bold px-3 py-1.5 rounded-[2px] border transition-colors ${formData.os === sys ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 text-gray-500'}`}>{sys}</button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Accessories & Warranty (New Ideas) */}
                                    <div className="p-4 grid grid-cols-2 gap-3">
                                        <button onClick={() => setFormData({...formData, hasWarranty: !formData.hasWarranty})} className={`p-3 rounded-[2px] border text-left transition-all ${formData.hasWarranty ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-transparent border-white/10 text-gray-500'}`}>
                                            <span className="block text-[10px] font-bold uppercase">Garancija</span>
                                            <i className={`fa-solid ${formData.hasWarranty ? 'fa-check' : 'fa-xmark'} mt-1`}></i>
                                        </button>
                                        <button onClick={() => setFormData({...formData, hasBox: !formData.hasBox})} className={`p-3 rounded-[2px] border text-left transition-all ${formData.hasBox ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-transparent border-white/10 text-gray-500'}`}>
                                            <span className="block text-[10px] font-bold uppercase">Original Kutija</span>
                                            <i className={`fa-solid ${formData.hasBox ? 'fa-check' : 'fa-xmark'} mt-1`}></i>
                                        </button>
                                        <button onClick={() => setFormData({...formData, hasCharger: !formData.hasCharger})} className={`p-3 rounded-[2px] border text-left transition-all ${formData.hasCharger ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-transparent border-white/10 text-gray-500'}`}>
                                            <span className="block text-[10px] font-bold uppercase">Punjač</span>
                                            <i className={`fa-solid ${formData.hasCharger ? 'fa-check' : 'fa-xmark'} mt-1`}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5b. CATEGORY SPECIFIC: VEHICLES */}
                        {formData.category === 'Vozila' && (
                            <div className="px-2">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Detalji Vozila</h3>
                                <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Godište" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-transparent border-b border-white/10 p-2 text-sm text-white outline-none" />
                                    <input type="number" placeholder="Kilometraža" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} className="bg-transparent border-b border-white/10 p-2 text-sm text-white outline-none" />
                                </div>
                            </div>
                        )}

                        {/* 6. Description */}
                        <div className="px-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Opis Artikla</label>
                            <div className="bg-[#121C26] rounded-sm border border-white/5 p-4 transition-colors focus-within:border-blue-500/30">
                                <textarea 
                                    rows={8} 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Detaljan opis stanja, karakteristike..." 
                                    className="w-full bg-transparent text-sm text-white placeholder:text-gray-700 outline-none resize-none" 
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- RIGHT: LIVE PREVIEW --- */}
            <div className="hidden lg:block w-[360px] shrink-0">
                <div className="sticky top-24">
                    <h3 className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Live Preview</h3>
                    <PhonePreview />
                </div>
            </div>

            {/* Sticky Mobile Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#060E14]/90 backdrop-blur-md border-t border-white/5 z-50">
                {isBasicStep ? (
                    <button 
                        onClick={() => setStep('form-details')}
                        disabled={!formData.title}
                        className="w-full bg-white text-black font-black py-4 rounded-[2px] flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
                    >
                        <span className="text-xs uppercase tracking-[2px]">Dalje</span>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                ) : (
                    <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="w-full blue-gradient text-white font-black py-4 rounded-[2px] flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isPublishing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-check"></i>}
                        <span className="text-xs uppercase tracking-[2px]">Objavi Oglas</span>
                    </button>
                )}
            </div>
        </div>
    </Layout>
  );
};

export default Upload;
