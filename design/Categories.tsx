
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { CATEGORIES } from '../constants';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCatId, setSelectedCatId] = useState<string>(CATEGORIES[0].id);

  const selectedCategory = CATEGORIES.find(c => c.id === selectedCatId) || CATEGORIES[0];

  const handleCategoryClick = (catName: string, subCat?: string) => {
    // Navigate to home and pass the selected category to filter the feed
    navigate('/home', { state: { category: catName, subCategory: subCat } });
  };

  return (
    <Layout 
        title="Kategorije" 
        showSigurnost={false} 
        headerRight={
            <button 
                onClick={() => navigate('/home')} 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
        }
    >
      <div className="flex flex-col h-[calc(100vh-80px)] bg-[#060E14]">
        
        {/* Split Content Container */}
        <div className="flex flex-1 overflow-hidden border-t border-white/5">
            
            {/* LEFT SIDEBAR (Main Categories) */}
            <div className="w-[85px] md:w-[280px] bg-[#0B1219] border-r border-white/5 overflow-y-auto no-scrollbar pb-24">
                {CATEGORIES.map((cat) => (
                    <button 
                        key={cat.id}
                        onClick={() => setSelectedCatId(cat.id)}
                        className={`w-full p-4 md:px-6 md:py-5 flex flex-col md:flex-row items-center md:gap-4 border-b border-white/5 transition-all relative group ${
                            selectedCatId === cat.id 
                            ? 'bg-[#121C26] text-blue-400' 
                            : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                        }`}
                    >
                        {/* Active Indicator */}
                        {selectedCatId === cat.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_#3B82F6]"></div>
                        )}
                        
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors ${selectedCatId === cat.id ? 'bg-blue-500/10' : 'bg-transparent'}`}>
                            <i className={`fa-solid ${cat.icon}`}></i>
                        </div>
                        
                        <span className="text-[9px] md:text-[13px] font-bold uppercase md:capitalize text-center md:text-left mt-1 md:mt-0 leading-tight">
                            {cat.name}
                        </span>

                        <i className={`hidden md:block fa-solid fa-chevron-right ml-auto text-xs ${selectedCatId === cat.id ? 'text-blue-500' : 'text-gray-700 opacity-0 group-hover:opacity-100'}`}></i>
                    </button>
                ))}
            </div>

            {/* RIGHT CONTENT (Subcategories) */}
            <div className="flex-1 bg-[#060E14] overflow-y-auto p-4 md:p-8 pb-24 relative">
                
                {/* Decorative Background Blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Selected Category Header */}
                <div className="mb-8 flex items-center gap-4 relative z-10 animate-[fadeIn_0.3s_ease-out]">
                    <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <i className={`fa-solid ${selectedCategory.icon} text-2xl`}></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">{selectedCategory.name}</h1>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{selectedCategory.subCategories.length} Potkategorija</p>
                    </div>
                </div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-[slideIn_0.2s_ease-out]">
                        {/* "Show All" Option */}
                        <button 
                        onClick={() => handleCategoryClick(selectedCategory.name)}
                        className="col-span-full md:col-span-1 text-left bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-[14px] flex justify-between items-center shadow-lg shadow-blue-500/20 mb-2 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                        <span className="text-xs font-black uppercase tracking-wider">Prikaži sve</span>
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                             <i className="fa-solid fa-arrow-right text-[10px]"></i>
                        </div>
                    </button>

                    {selectedCategory.subCategories.map((sub, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleCategoryClick(selectedCategory.name, sub)}
                            className="text-left bg-[#121C26] border border-white/5 p-4 rounded-[14px] flex justify-between items-center hover:bg-white/5 hover:border-white/10 transition-all group active:scale-[0.99]"
                        >
                            <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{sub}</span>
                            <i className="fa-solid fa-chevron-right text-[10px] text-gray-700 group-hover:text-blue-400 transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100"></i>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
