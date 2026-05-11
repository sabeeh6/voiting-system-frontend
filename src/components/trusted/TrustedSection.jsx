import { motion } from "framer-motion";

const partners = [
  { name: "Trustly", width: "w-20" },
  { name: "AWS", width: "w-14" },
  { name: "Azure", width: "w-16" },
  { name: "Google Cloud", width: "w-28" },
  { name: "Auth0", width: "w-16" },
];

export default function TrustedSection() {
  return (
    <section
      id="trusted"
      className="py-20 lg:py-24 bg-white border-t border-neutral-100"
      aria-label="Trusted by industry leaders"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Infrastructure Powered By
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Trusted by <span className="text-votex-600">Industry Leaders</span>
          </h2>
        </motion.div>

        {/* Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16"
        >
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              className="group flex items-center justify-center"
            >
              <div className="px-6 py-4 rounded-2xl border border-transparent hover:border-neutral-200 hover:bg-neutral-50/50 transition-all duration-300">
                {/* Text-based logo placeholder */}
                <span className="text-xl sm:text-2xl font-extrabold text-neutral-300 group-hover:text-votex-500 transition-colors duration-300 tracking-tight select-none">
                  {partner.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-neutral-100 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-4">
              Ready to Modernize Your Elections?
            </h3>
            <p className="text-neutral-500 text-lg mb-8 leading-relaxed">
              Join hundreds of organizations already trusting Votex for their 
              most critical decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-bold text-white bg-votex-600 rounded-2xl hover:bg-votex-700 transition-colors shadow-xl shadow-votex-600/20"
              >
                Get Started — It's Free
              </motion.a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-bold text-votex-700 hover:text-votex-800 transition-colors"
              >
                Contact Sales →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
