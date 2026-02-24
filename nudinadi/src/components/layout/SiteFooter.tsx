import Link from 'next/link';

export default function SiteFooter() {
  const linkClass = "text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors";

  return (
    <footer className="border-t border-gray-200 dark:border-[var(--c-border)] bg-gray-50 dark:bg-[var(--c-bg)] px-4 md:px-8 pt-10 pb-40 md:pb-16 mt-8">
      <div className="max-w-5xl mx-auto">

        {/* TOP SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg blue-gradient flex items-center justify-center">
                <span className="font-black text-white italic text-sm">N</span>
              </div>
              <span className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">NudiNađi</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4 max-w-[220px]">
              Moderna platforma za kupovinu i prodaju. AI podrška, sigurne transakcije, brza pretraga.
            </p>
            <div className="flex gap-2">
              <span className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-[var(--c-border)] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-sm">
                <i className="fa-brands fa-instagram text-xs"></i>
              </span>
              <span className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-[var(--c-border)] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-sm">
                <i className="fa-brands fa-facebook-f text-xs"></i>
              </span>
              <span className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-[var(--c-border)] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-sm">
                <i className="fa-brands fa-tiktok text-xs"></i>
              </span>
              <span className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-[var(--c-border)] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-sm">
                <i className="fa-brands fa-twitter text-xs"></i>
              </span>
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">Marketplace</h4>
            <ul className="space-y-2.5">
              <li><Link href="/?category=Vozila" className={linkClass}>Vozila</Link></li>
              <li><Link href="/?category=Nekretnine" className={linkClass}>Nekretnine</Link></li>
              <li><Link href="/?category=Elektronika" className={linkClass}>Elektronika</Link></li>
              <li><Link href="/?category=Odjeća i obuća" className={linkClass}>Odjeća i obuća</Link></li>
              <li><Link href="/" className="text-[11px] text-blue-500 hover:text-blue-700 transition-colors font-bold">Sve kategorije →</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">Kompanija</h4>
            <ul className="space-y-2.5">
              <li><Link href="/o-nama" className={linkClass}>O Nama</Link></li>
              <li><Link href="/karijere" className={linkClass}>Karijere</Link></li>
              <li><Link href="/press" className={linkClass}>Press</Link></li>
              <li><Link href="/blog" className={linkClass}>Blog</Link></li>
              <li><Link href="/partneri" className={linkClass}>Partneri</Link></li>
            </ul>
          </div>

          {/* Support / Legal Links */}
          <div>
            <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">Podrška</h4>
            <ul className="space-y-2.5">
              <li><Link href="/pomoc" className={linkClass}>Pomoć / FAQ</Link></li>
              <li><Link href="/kontakt" className={linkClass}>Kontakt</Link></li>
              <li><Link href="/sigurnost" className={linkClass}>Sigurnosni centar</Link></li>
              <li><Link href="/uvjeti" className={linkClass}>Uvjeti korištenja</Link></li>
              <li><Link href="/privatnost" className={linkClass}>Privatnost</Link></li>
            </ul>
          </div>
        </div>

        {/* APP DOWNLOAD */}
        <div className="py-6 border-t border-gray-200 dark:border-[var(--c-border)]">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Preuzmi Aplikaciju</p>
          <div className="flex gap-2">
            <span className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-[10px] cursor-pointer hover:bg-gray-800 transition-colors">
              <i className="fa-brands fa-apple text-white text-lg"></i>
              <div>
                <p className="text-[7px] text-gray-400 leading-none">Dostupno na</p>
                <p className="text-[10px] font-bold text-white leading-tight">App Store</p>
              </div>
            </span>
            <span className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-[10px] cursor-pointer hover:bg-gray-800 transition-colors">
              <i className="fa-brands fa-google-play text-white text-lg"></i>
              <div>
                <p className="text-[7px] text-gray-400 leading-none">Preuzmi na</p>
                <p className="text-[10px] font-bold text-white leading-tight">Google Play</p>
              </div>
            </span>
          </div>
        </div>

        {/* BOTTOM BAR: Impressum + Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-6 border-t border-gray-200 dark:border-[var(--c-border)]">
          <div className="flex flex-wrap items-center gap-3 text-[9px] text-gray-400">
            <Link href="/o-nama" className="hover:text-gray-600 transition-colors">O nama</Link>
            <span>·</span>
            <Link href="/uvjeti" className="hover:text-gray-600 transition-colors">Uvjeti korištenja</Link>
            <span>·</span>
            <Link href="/privatnost" className="hover:text-gray-600 transition-colors">Privatnost</Link>
            <span>·</span>
            <Link href="/kolacici" className="hover:text-gray-600 transition-colors">Kolačići</Link>
            <span>·</span>
            <Link href="/kontakt" className="hover:text-gray-600 transition-colors">Kontakt</Link>
          </div>
          <div className="text-[9px] text-gray-400 flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} NudiNađi d.o.o.</span>
            <span>·</span>
            <span>Sva prava zadržana</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
