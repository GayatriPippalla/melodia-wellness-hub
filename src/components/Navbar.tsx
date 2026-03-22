import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Daily Motivation", href: "/motivation" },
  { label: "Free Wellness Assessment", href: "/assessment" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = true }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let unsubscribeDiscovery: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userId = currentUser.uid;
        
        // Finalized strict query: user_id (snake_case) only
        const q = query(collection(db, "discovery_requests"), where("user_id", "==", userId));

        unsubscribeDiscovery = onSnapshot(q, (snapshot) => {
          let count = 0;
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.messages && Array.isArray(data.messages)) {
              // Count messages from admin that haven't been read by the user
              const unread = data.messages.filter((m: any) => m.sender === "admin" && m.read === false);
              count += unread.length;
            }
          });
          setUnreadCount(count);
        }, (err) => {
          console.error("Navbar: Notification listener error:", err);
        });
      } else {
        setUnreadCount(0);
        if (unsubscribeDiscovery) unsubscribeDiscovery();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDiscovery) unsubscribeDiscovery();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    navigate("/");
  };

  const bgClass = scrolled
    ? "glass shadow-soft"
    : transparent
      ? "bg-transparent"
      : "bg-background/80 backdrop-blur-md border-b border-border";

  const linkClass = (href: string) =>
    `font-body text-sm tracking-wide transition-colors duration-300 ${
      location.pathname === href
        ? "text-primary font-medium"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const mobileLinkClass = (href: string) =>
    `font-body text-base transition-colors duration-300 ${
      location.pathname === href
        ? "text-primary font-medium"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}>
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <Link to="/home" className="transition-transform duration-300 hover:scale-[1.02]">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link to={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`relative font-body text-sm tracking-wide transition-colors duration-300 ${
                  location.pathname === "/dashboard"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-body text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`font-body text-sm tracking-wide transition-colors duration-300 ${
                  location.pathname === "/login"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="group relative overflow-hidden rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-glow hover:scale-[1.02]"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-sage-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground p-1"
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden glass overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-4 py-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} onClick={() => setOpen(false)} className={mobileLinkClass(link.href)}>
                    {link.label}
                  </Link>
                </li>
              ))}

              {user ? (
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setOpen(false)} 
                      className={`${mobileLinkClass("/dashboard")} flex items-center gap-2`}
                    >
                      Dashboard
                    {unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] ml-2">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  </li>
                  <li className="mt-2">
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 font-body text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setOpen(false)} className={mobileLinkClass("/login")}>
                      Login
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      to="/signup"
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:shadow-glow transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
