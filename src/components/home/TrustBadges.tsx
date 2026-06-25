import { ShieldCheck, Zap, CalendarX, Star } from 'lucide-react';

interface TrustBadge {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel: string;
  color: string;
}

const badges: TrustBadge[] = [
  { icon: ShieldCheck, label: 'Best Price', sublabel: 'Guaranteed', color: 'emerald' },
  { icon: Zap, label: 'Instant', sublabel: 'Confirmation', color: 'blue' },
  { icon: CalendarX, label: 'Free Cancel', sublabel: 'Most rooms', color: 'violet' },
  { icon: Star, label: '4.8 Avg', sublabel: 'Guest rating', color: 'amber' },
];

export default function TrustBadges() {
  return (
    <div className="max-w-5xl mx-auto mt-10 sm:mt-14">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {badges.map((item, idx) => (
          <div
            key={idx}
            className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-800/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1"
          >
            <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`} />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{item.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.sublabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
