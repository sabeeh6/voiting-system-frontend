import { motion } from "framer-motion";
import { Shield, Eye, Globe, Server } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure",
    subtitle: "End-to-end Encryption",
    description: "Every vote is encrypted from submission to storage. Military-grade cryptography ensures your data remains tamper-proof.",
  },
  {
    icon: Eye,
    title: "Transparent",
    subtitle: "Real-time Audit Logs",
    description: "Full visibility into every action. Immutable audit trails ensure complete accountability and verifiable results.",
  },
  {
    icon: Globe,
    title: "Accessible",
    subtitle: "Vote from Anywhere",
    description: "Cast your vote from any device, anywhere in the world. Our platform adapts to every screen seamlessly.",
  },
  {
    icon: Server,
    title: "Reliable",
    subtitle: "99.99% Uptime",
    description: "Built on distributed infrastructure with automatic failover. Your elections never go down, even under peak load.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Built for Trust. <span className="text-votex-600">Designed for Scale.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed font-medium">
            Every feature is engineered to protect voter integrity while delivering a seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-white rounded-[2rem] border border-gray-100 premium-shadow hover:premium-shadow-hover transition-all duration-300"
              >
                <div className="w-14 h-14 bg-votex-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-votex-100 transition-all">
                  <Icon className="text-votex-600" size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs font-black text-votex-600 uppercase tracking-widest mb-3">{feature.subtitle}</p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
