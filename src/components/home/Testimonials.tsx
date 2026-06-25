import { Star, Quote, Heart } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      text: 'Amazing experience! The booking was seamless and the hotel exceeded all expectations. Will definitely use again.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      location: 'London, UK',
      text: 'Best prices I found anywhere. The instant confirmation was a lifesaver for my last-minute business trip.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      text: 'The filters made it so easy to find exactly what we needed. Free cancellation gave us peace of mind.',
      rating: 5,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-16 sm:mt-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-full mb-4">
          <Heart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest">Testimonials</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          What our guests say
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-800/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1"
          >
            <Quote className="h-8 w-8 text-blue-200 dark:text-blue-900 mb-3" />
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{review.text}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{review.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{review.location}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
