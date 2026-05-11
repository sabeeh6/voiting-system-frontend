import { Heart } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Security", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "API Reference", "Status", "Community"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer
      className="bg-neutral-900 text-neutral-400 pt-16 pb-8"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-votex-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Vot<span className="text-votex-400">ex</span>
              </span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-[200px]">
              Modern voting infrastructure for organizations that value trust and transparency.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-neutral-200 mb-4 tracking-wide">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-neutral-500 hover:text-votex-400 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} Votex. All rights reserved.
          </p>
          <p className="text-sm text-neutral-600 flex items-center gap-1.5">
            Made with{" "}
            <Heart size={14} className="text-votex-500 fill-votex-500" />{" "}
            for fair elections
          </p>
        </div>
      </div>
    </footer>
  );
}
