import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "#home", type: "hash" as const },
  { label: "About", href: "/about", type: "route" as const },
  { label: "Services", href: "/services", type: "route" as const },
  { label: "Daily Motivation", href: "/motivation", type: "route" as const },
  { label: "Assessment", href: "/assessment", type: "route" as const },
  { label: "Contact", href: "/contact", type: "route" as const },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <Link to="/" className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-foreground">
          Melodia
        </Link>

        {/* Desktop */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.type === "route" ? (
                <Link
                  to={link.href}
                  className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden lg:inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
        >
          Book a Call
        </a>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.type === "route" ? (
                    <Link
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="font-body text-base text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-body text-base text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Book a Call
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
