import { MapPin, Phone, Mail, Globe } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
  ],
  support: [
    { label: 'Contact Us', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
  destinations: [
    { label: 'Hotels', href: '#' },
    { label: 'Resorts', href: '#' },
    { label: 'Apartments', href: '#' },
    { label: 'Villas', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100/80 dark:border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">StayFinder</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Discover handpicked hotels, resorts & apartments at exclusive prices worldwide.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>123 Travel Street, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span>+880 1234 567890</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>support@stayfinder.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2">
              {footerLinks.destinations.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100/80 dark:border-gray-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} StayFinder. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Globe className="h-3 w-3" />
            <span>Made with ❤️ for travelers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
