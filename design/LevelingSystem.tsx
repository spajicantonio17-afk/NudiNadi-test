
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { CURRENT_USER } from '../constants';

const LevelingSystem: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock Data based on Current User
  const currentLevel = 5;
  const currentXP = 1250;
  const nextLevelXP = 2500;
  const progressPercentage = (currentXP / nextLevelXP) * 100;

  return (
    <Layout title="Level Sistem" showSigurnost={false} headerRight={<button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"><i className="fa-solid fa-xmark"></i></button>}>
      <div className="pt-4 pb-24 px-4 md:px-0 max-w-2xl mx-auto">
        
        {/* --- HERO SECTION --- */}
        <div className="relative mb-8 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
                    {/* Outer Ring - Kept Round for Gauge Logic */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-[#121C26]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" strokeDasharray={`${progressPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    
                    {/* Inner Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Level</span>
                        <span className="text-4xl font-black text-white leading-none">{currentLevel}</span>
                    </div>
                </div>

                <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Napredni Prodavač</h1>
                <p className="text-xs text-gray-400 font-medium mb-4">Još <span className="text-white font-bold">{nextLevelXP - currentXP} XP</span> do Levela {currentLevel + 1}</p>

                {/* Progress Bar Label - Sharpened */}
                <div className="w-full max-w-xs bg-[#121C26] rounded-sm h-3 border border-white/10 overflow-hidden relative">
                    <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-amber-600 rounded-sm shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                        style={{ width: '50%' }}
                    ></div>
                </div>
                <div className="flex justify-between w-full max-w-xs mt-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                    <span>{currentXP} XP</span>
                    <span>{nextLevelXP} XP</span>
                </div>
            </div>
        </div>

        {/* --- SYSTEM EXPLANATION --- */}
        <div className="bg-[#121C26] border border-white/5 rounded-sm p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl"></div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                <i className="fa-solid fa-layer-group text-blue-500"></i> Kako sistem radi?
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Level sistem je dizajniran da nagradi aktivne i pouzdane korisnike. 
                Sistem ide do <span className="text-white font-bold">Levela 20</span>. 
                Što je veći level, teže je napredovati, jer svaki novi nivo zahtijeva više XP bodova.
            </p>
            <div className="flex gap-2">
                 <div className="flex-1 bg-black/20 rounded-[2px] p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                     <span className="text-lg font-black text-white">1-5</span>
                     <span className="text-[8px] text-gray-500 uppercase tracking-wider">Početnik</span>
                 </div>
                 <div className="flex-1 bg-gradient-to-br from-blue-900/20 to-blue-600/20 rounded-[2px] p-3 border border-blue-500/30 flex flex-col items-center justify-center text-center">
                     <span className="text-lg font-black text-blue-400">5-15</span>
                     <span className="text-[8px] text-blue-300 uppercase tracking-wider">Napredni</span>
                 </div>
                 <div className="flex-1 bg-black/20 rounded-[2px] p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                     <span className="text-lg font-black text-amber-500">15-20</span>
                     <span className="text-[8px] text-gray-500 uppercase tracking-wider">Ekspert</span>
                 </div>
            </div>
        </div>

        {/* --- EARN XP GRID --- */}
        <h2 className="text-[11px] font-black uppercase tracking-[2px] text-gray-500 mb-4 px-2">Kako zaraditi XP?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Action 1: Upload */}
            <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[2px] bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <i className="fa-solid fa-plus"></i>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-white">Novi Oglas</h3>
                        <p className="text-[9px] text-gray-500">Za svaki objavljen artikal</p>
                    </div>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-[2px]">+50 XP</span>
            </div>

            {/* Action 2: Review */}
            <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex items-center justify-between group hover:border-yellow-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[2px] bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-white">Dojam / Review</h3>
                        <p className="text-[9px] text-gray-500">Kada ostaviš dojam korisniku</p>
                    </div>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-[2px]">+100 XP</span>
            </div>

            {/* Action 3: High Value */}
            <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[2px] bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                        <i className="fa-solid fa-gem"></i>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-white">High Value</h3>
                        <p className="text-[9px] text-gray-500">Artikli preko €100,000</p>
                    </div>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-[2px]">+50 XP</span>
            </div>

            {/* Action 4: Sale Success */}
            <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[2px] bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <i className="fa-solid fa-handshake"></i>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-white">Uspješna Prodaja</h3>
                        <p className="text-[9px] text-gray-500">Označeno kao "Prodano"</p>
                    </div>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-[2px]">+200 XP</span>
            </div>

            {/* Action 5: Online Time */}
            <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[2px] bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                        <i className="fa-regular fa-clock"></i>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-white">Online Vrijeme</h3>
                        <p className="text-[9px] text-gray-500">Aktivno korištenje (po satu)</p>
                    </div>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-[2px]">+10 XP</span>
            </div>

             {/* Action 6: Verification */}
             <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex items-center justify-between group hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[2px] bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-white">Verifikacija</h3>
                        <p className="text-[9px] text-gray-500">Potvrda identiteta (jednokratno)</p>
                    </div>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-[2px]">+500 XP</span>
            </div>

        </div>

      </div>
    </Layout>
  );
};

export default LevelingSystem;
