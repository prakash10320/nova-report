
import React from 'react';
import { Heart, Github, Twitter, Linkedin, Mail, Globe, Shield, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 backdrop-blur-xl border-t border-border/50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold">
                N
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NewsPro
              </h3>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 max-w-md">
              Stay informed with the latest news from around the world. We deliver real-time updates, 
              in-depth analysis, and comprehensive coverage across all major categories.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@newspro.com"
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              {[
                { name: 'Technology', href: '#' },
                { name: 'Business', href: '#' },
                { name: 'Sports', href: '#' },
                { name: 'Health', href: '#' },
                { name: 'Science', href: '#' },
                { name: 'Entertainment', href: '#' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { name: 'About Us', href: '#', icon: Globe },
                { name: 'Privacy Policy', href: '#', icon: Shield },
                { name: 'Terms of Service', href: '#', icon: FileText },
                { name: 'Contact', href: '#', icon: Mail }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-border/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-2">Stay Updated</h4>
              <p className="text-muted-foreground text-sm">
                Get the latest news delivered directly to your inbox
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-secondary/50 border border-border/50 rounded-l-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-xl hover:bg-primary/90 transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center text-muted-foreground text-sm">
            <span>© {currentYear} NewsPro. All rights reserved.</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
            <span>for news enthusiasts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
