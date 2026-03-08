import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Daily Motivation", href: "/motivation" },
  { label: "Assessment", href: "/assessment" },
  { label: "Contact", href: "/contact" },
  { label: "Sign Up", href: "/signup" },
];

const PageNavbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "glass shadow-soft" : "bg-background/80 backdrop-blur-md border-b border-border"
    }`}>
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <Link to="/" className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-foreground">
          Melodia
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`font-body text-sm tracking-wide transition-colors duration-300 ${
                  location.pathname === link.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/contact"
          className="hidden lg:inline-flex group relative overflow-hidden rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-glow hover:scale-[1.02]"
        >
          <span className="relative z-10">Book a Call</span>
          <div className="absolute inset-0 bg-sage-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        <button
          className="lg:hidden text-foreground p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden glass overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-4 py-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={`font-body text-base transition-colors duration-300 ${
                      location.pathname === link.href
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Book a Call
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PageNavbar;
