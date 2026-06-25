export default function NewsletterCTA() {
  return (
    <div className="max-w-5xl mx-auto mt-16 sm:mt-20 mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to start your journey?</h2>
        <p className="text-blue-100 mb-6 max-w-xl mx-auto">
          Subscribe to get exclusive deals, travel inspiration, and insider tips delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 h-12 px-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <button className="h-12 px-6 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
