'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, lastError } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!formData.email.trim()) e.email = 'Email je obavezan';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Neispravan email format';
    if (!formData.password) e.password = 'Lozinka je obavezna';
    else if (formData.password.length < 6) e.password = 'Minimalno 6 znakova';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
      if (!validate()) return;
      setIsLoading(true);
      setErrors({});
      try {
        const success = await login(formData.email, formData.password);
        if (success) {
          showToast('Uspješna prijava!');
          router.push('/');
        } else {
          setIsLoading(false);
          setErrors({ auth: lastError || 'Pogrešan email ili lozinka' });
        }
      } catch (err) {
        setIsLoading(false);
        setErrors({ auth: err instanceof Error ? err.message : 'Greška pri prijavi. Pokušajte ponovo.' });
      }
  };

  return (
    <div className="min-h-screen bg-[var(--c-bg)] text-[var(--c-text)] flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-xs space-y-5 z-10 animate-[fadeIn_0.3s_ease-out]">
            <div className="text-center mb-8">
                <div onClick={() => router.push('/')} className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white text-2xl font-black italic shadow-lg shadow-blue-500/20 mx-auto mb-6 cursor-pointer">
                    N
                </div>
                <h2 className="text-2xl font-black text-[var(--c-text)] mb-2">Dobrodošli nazad</h2>
                <p className="text-xs text-[var(--c-text3)]">Unesite podatke za pristup računu.</p>
            </div>

            <div className="space-y-3">
                <div>
                  <div className={`bg-[var(--c-card)] border rounded-[18px] p-1.5 pr-4 flex items-center gap-3 focus-within:border-blue-500/50 transition-colors group ${errors.email ? 'border-red-500/50' : 'border-[var(--c-border2)]'}`}>
                    <div className="w-10 h-10 rounded-[14px] bg-[var(--c-hover)] flex items-center justify-center text-[var(--c-text3)] group-focus-within:text-blue-500 group-focus-within:bg-blue-500/10 transition-colors">
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="flex-1">
                        <label className="text-[8px] font-bold text-[var(--c-text3)] uppercase tracking-wider block mb-0.5">Email</label>
                        <input
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={e => { setFormData({...formData, email: e.target.value}); if (errors.email) setErrors({...errors, email: undefined}); }}
                            placeholder="tvoj@email.com"
                            className="w-full bg-transparent text-sm text-[var(--c-text)] font-bold outline-none placeholder:text-[var(--c-placeholder)]"
                        />
                    </div>
                  </div>
                  {errors.email && <p className="text-[10px] text-red-400 mt-1 ml-3">{errors.email}</p>}
                </div>

                <div>
                  <div className={`bg-[var(--c-card)] border rounded-[18px] p-1.5 pr-4 flex items-center gap-3 focus-within:border-blue-500/50 transition-colors group ${errors.password ? 'border-red-500/50' : 'border-[var(--c-border2)]'}`}>
                    <div className="w-10 h-10 rounded-[14px] bg-[var(--c-hover)] flex items-center justify-center text-[var(--c-text3)] group-focus-within:text-blue-500 group-focus-within:bg-blue-500/10 transition-colors">
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="flex-1">
                        <label className="text-[8px] font-bold text-[var(--c-text3)] uppercase tracking-wider block mb-0.5">Lozinka</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={e => { setFormData({...formData, password: e.target.value}); if (errors.password) setErrors({...errors, password: undefined}); }}
                            placeholder="••••••••"
                            className="w-full bg-transparent text-sm text-[var(--c-text)] font-bold outline-none placeholder:text-[var(--c-placeholder)]"
                        />
                    </div>
                  </div>
                  {errors.password && <p className="text-[10px] text-red-400 mt-1 ml-3">{errors.password}</p>}
                </div>
            </div>

            {errors.auth && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-[14px] px-4 py-3 text-xs text-red-400">
                    <i className="fa-solid fa-circle-exclamation mr-2"></i>{errors.auth}
                </div>
            )}

            <button onClick={handleLogin} disabled={isLoading} className="w-full py-4 rounded-[20px] blue-gradient text-white font-black text-xs uppercase tracking-[2px] shadow-xl shadow-blue-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-arrow-right-to-bracket"></i> Prijavi se</>}
            </button>

            <div className="text-center mt-6">
                <p className="text-[10px] text-[var(--c-text3)] font-bold uppercase tracking-widest mb-3">Nemaš račun?</p>
                <button
                    onClick={() => router.push('/register')}
                    className="px-6 py-3 rounded-full border border-[var(--c-border2)] text-[10px] font-bold text-[var(--c-text)] hover:bg-[var(--c-hover)] transition-colors uppercase tracking-wider"
                >
                    Registriraj se
                </button>
            </div>
             <button
                onClick={() => router.push('/')}
                className="w-full text-center py-4 text-[10px] text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition-colors uppercase tracking-widest"
            >
                Nastavi kao Gost
            </button>
        </div>
    </div>
  );
}
