import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t hairline bg-[#1A1A1A] text-white mt-12 md:mt-20">
      <div className="max-w-[1480px] mx-auto px-4 md:px-8 py-10 md:py-12 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-10">
        <div className="col-span-2">
          <BrandLogo variant="light" size="lg" />
          <p className="mt-4 text-xs md:text-sm text-white/60 max-w-sm leading-relaxed">
            South India's heritage textile house meets the modern wardrobe. Kanjeevaram silks, hand-block prints, and contemporary edits — straight from artisan looms to your doorstep.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a className="bg-white/10 hover:bg-[var(--brand-pink)] text-xs px-3 py-2 transition-colors cursor-pointer rounded-sm">Mail Us</a>
            <a className="bg-white/10 hover:bg-[var(--brand-pink)] text-xs px-3 py-2 transition-colors cursor-pointer rounded-sm">Become a Seller</a>
          </div>
        </div>
        <FooterCol title="About" items={["Contact Us", "About KKP", "Careers", "Press", "Heritage"]} />
        <FooterCol title="Help" items={["Payments", "Shipping", "Returns", "FAQ"]} />
        <FooterCol title="Policy" items={["Return Policy", "Terms of Use", "Privacy", "Sitemap"]} />
      </div>
      <div className="border-t border-white/10 py-4 md:py-5 px-4 text-center text-[10px] md:text-xs text-white/50 font-mono">
        © {new Date().getFullYear()} KKP STORES — Made in India. Made with heritage.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="eyebrow text-white/40 mb-3">{title}</div>
      <ul className="space-y-2 text-sm text-white/80">
        {items.map((i) => <li key={i} className="hover:text-[var(--brand-pink)] cursor-pointer transition-colors">{i}</li>)}
      </ul>
    </div>
  );
}
