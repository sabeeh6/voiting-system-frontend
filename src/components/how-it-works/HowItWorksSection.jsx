import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, FileCheck, Lock, BarChart3 } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Register", description: "Create your secure account in seconds." },
  { icon: ShieldCheck, title: "Verify", description: "Identity verification ensures eligible voters." },
  { icon: FileCheck, title: "Vote", description: "Cast your ballot through our intuitive interface." },
  { icon: Lock, title: "Secure", description: "Your vote is encrypted and anonymized instantly." },
  { icon: BarChart3, title: "Results", description: "View real-time, auditable results with transparency." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Five Steps to a <span className="text-votex-600">Fair Election.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed font-medium">
            From registration to results — every step is designed to be effortless and bulletproof.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-6">
          {/* Connecting Line Desktop */}
          <div className="hidden lg:block absolute top-[50px] left-[10%] right-[10%] h-0.5 bg-gray-100 -z-10" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white border-2 border-gray-50 rounded-full flex items-center justify-center premium-shadow group hover:border-votex-500 transition-all duration-300">
                    <Icon className="text-votex-600 group-hover:scale-110 transition-transform" size={28} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-votex-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed max-w-[160px] font-medium">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
