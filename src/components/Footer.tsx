import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Motivation", href: "/motivation" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => (
  <footer className="relative overflow-hidden">
    {/* Gradient top border */}
    <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

    <div className="bg-foreground py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 items-start">
          {/* Brand */}
          <div>
            <p className="font-display text-3xl font-semibold text-primary-foreground mb-2">Melodia</p>
            <p className="font-body text-sm text-primary-foreground/50 leading-relaxed max-w-xs">
              Tune into your wellness. Holistic coaching for mind, body, and spirit.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-center">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="md:text-right">
            <p className="font-body text-sm text-primary-foreground/50 mb-1">melodia@wellness.com</p>
            <p className="font-body text-sm text-primary-foreground/50">Austin, TX</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-primary-foreground/30">
            © {new Date().getFullYear()} Melodia Wellness. All rights reserved.
          </p>
          <p className="font-body text-xs text-primary-foreground/30 flex items-center gap-1">
            Made with <Heart size={10} className="text-primary" /> from Melodia
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
