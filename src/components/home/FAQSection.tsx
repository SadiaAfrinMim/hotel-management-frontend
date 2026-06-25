'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I search for hotels?',
    answer: 'Enter your destination, dates, and number of guests in the search form above. Click "Search Hotels" to see available options.',
  },
  {
    question: 'Can I cancel my booking for free?',
    answer: 'Yes, most of our hotels offer free cancellation. Look for the "Free Cancel" badge on hotel listings for details.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'Our support team is available 24/7. Use the contact form in the app or email us at support@stayfinder.com.',
  },
  {
    question: 'Are the prices shown per night or per stay?',
    answer: 'Prices are shown per night unless otherwise specified. Total cost will be calculated based on your selected dates.',
  },
  {
    question: 'Do I need to create an account to book?',
    answer: 'You can search without an account, but you will need to sign up or log in to complete your booking.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 sm:mt-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 rounded-full mb-4">
          <HelpCircle className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          <span className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-widest">FAQ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Frequently asked questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Everything you need to know about booking with StayFinder
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
            >
              <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white pr-4">{faq.question}</span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
