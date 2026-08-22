import React from 'react';
import { Cpu, Target, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Cpu,
    title: 'Curated Matches',
    description: 'Our AI-driven matching engine looks beyond the resume, analyzing complementary skill sets and cognitive diversity to ensure a balanced leadership team.'
  },
  {
    icon: Target,
    title: 'Vision Alignment',
    description: 'We facilitate the hard conversations early. Our proprietary vision mapping tool ensures you and your partner are aligned on scale, funding, and culture.'
  },
  {
    icon: ShieldCheck,
    title: 'Verified Founders',
    description: 'Join a trusted ecosystem of high-conviction founders. Every member is vetted for authenticity and intent, cutting out the noise of traditional networking.'
  }
];

export default function Aim() {
  return (
    <section className="bg-[#f8fafc] py-16 px-6 w-full">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-5">
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}