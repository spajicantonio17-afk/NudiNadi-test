
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { CURRENT_USER } from '../constants';

const UserInfo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Info" showSigurnost={false} headerRight={<button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"><i className="fa-solid fa-arrow-left"></i></button>}>
      <div className="pt-4 pb-24 px-4 md:px-0 max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-sm p-1 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/20 mx-auto mb-4">
                <img src={CURRENT_USER.avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-[2px] border-2 border-[#060E14]" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">{CURRENT_USER.username}</h1>
            <p className="text-sm text-gray-400">{CURRENT_USER.fullName}</p>
        </div>

        {/* Stats Grid */}
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Statistika</h3>
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex flex-col items-start gap-2 hover:border-blue-500/30 transition-colors">
                <div className="w-8 h-8 rounded-sm bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <i className="fa-regular fa-calendar"></i>
                </div>
                <div>
                        <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Član od</h3>
                        <p className="text-xs font-bold text-white">Oktobar 2023</p>
                </div>
            </div>
            <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex flex-col items-start gap-2 hover:border-blue-500/30 transition-colors">
                <div className="w-8 h-8 rounded-sm bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                        <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Lokacija</h3>
                        <p className="text-xs font-bold text-white">Sarajevo, BiH</p>
                </div>
            </div>
            <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex flex-col items-start gap-2 hover:border-blue-500/30 transition-colors">
                    <div className="w-8 h-8 rounded-sm bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <i className="fa-regular fa-clock"></i>
                </div>
                <div>
                        <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Odgovara za</h3>
                        <p className="text-xs font-bold text-white">~ 1 sat</p>
                </div>
            </div>
            <div className="bg-[#121C26] border border-white/5 rounded-sm p-4 flex flex-col items-start gap-2 hover:border-emerald-500/30 transition-colors">
                <div className="w-8 h-8 rounded-sm bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                        <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Verifikacija</h3>
                        <p className="text-xs font-bold text-emerald-400">Potvrđeno</p>
                </div>
            </div>
        </div>

        {/* Bio */}
        <div className="bg-[#121C26] border border-white/5 rounded-sm p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl"></div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-l-2 border-blue-500 pl-2">O Meni</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-mono relative z-10">
                Ljubitelj tehnologije i automobila. Često prodajem očuvane gadgete i opremu. 
                Sve stvari su originalne i dolaze sa kutijom osim ako nije drugačije navedeno.
                Preferiram lično preuzimanje u Sarajevu, ali šaljem i brzom poštom.
            </p>
        </div>
        
        {/* Social / Contact Info */}
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Social & Links</h3>
        <div className="space-y-2">
                <div className="flex items-center justify-between bg-[#121C26] border border-white/5 rounded-sm p-4 cursor-pointer hover:bg-white/5 transition-colors group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-white transition-colors">OLX Profil</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-gray-600 text-xs group-hover:text-blue-400 transition-colors"></i>
                </div>
                <div className="flex items-center justify-between bg-[#121C26] border border-white/5 rounded-sm p-4 cursor-pointer hover:bg-white/5 transition-colors group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-white transition-colors">Instagram</span>
                    <i className="fa-brands fa-instagram text-gray-600 text-xs group-hover:text-pink-400 transition-colors"></i>
                </div>
                <div className="flex items-center justify-between bg-[#121C26] border border-white/5 rounded-sm p-4 cursor-pointer hover:bg-white/5 transition-colors group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-white transition-colors">Facebook</span>
                    <i className="fa-brands fa-facebook text-gray-600 text-xs group-hover:text-blue-600 transition-colors"></i>
                </div>
        </div>

      </div>
    </Layout>
  );
};

export default UserInfo;
