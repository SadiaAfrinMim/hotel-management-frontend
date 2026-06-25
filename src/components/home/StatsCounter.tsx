import { Award, ThumbsUp, Clock, Globe } from 'lucide-react';

export default function StatsCounter() {
  return (
    <div className="max-w-5xl mx-auto mt-16 sm:mt-20">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="text-center mb-8">
          <Award className="h-8 w-8 text-amber-400 mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Trusted by millions worldwide</h2>
          <p className="text-blue-100/70 max-w-xl mx-auto">Join over 10 million happy travelers who book with us every year</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '10M+', label: 'Happy Travelers', icon: ThumbsUp },
            { value: '150K+', label: 'Verified Hotels', icon: Award },
            { value: '200+', label: 'Countries', icon: Globe },
            { value: '24/7', label: 'Support', icon: Clock },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-blue-200/70 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
