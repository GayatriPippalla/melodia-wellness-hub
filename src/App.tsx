import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import ClickSpark from "./components/ClickSpark";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import DailyMotivationPage from "./pages/DailyMotivationPage";
import WellnessAssessmentPage from "./pages/WellnessAssessmentPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import DiscoveryCallPage from "./pages/DiscoveryCallPage";
import NewsletterUnsubscribe from "./pages/NewsletterUnsubscribe";
import NotFound from "./pages/NotFound";
import ChatBox from "./components/ChatBox";
import { useState, useEffect } from "react";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const queryClient = new QueryClient();

const GlobalChat = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    const unsubscribeProfile = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    });
    return () => unsubscribeProfile();
  }, [user]);

  const isAdminPage = location.pathname.startsWith("/admin");

  if (!user || !profile || isAdminPage) return null;

  return <ChatBox userId={user.uid} userName={profile.fullName || "User"} />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/home" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
        <Route path="/motivation" element={<PageTransition><DailyMotivationPage /></PageTransition>} />
        <Route path="/assessment" element={<PageTransition><WellnessAssessmentPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><UserDashboard /></PageTransition>} />
        <Route path="/discovery" element={<PageTransition><DiscoveryCallPage /></PageTransition>} />
        <Route path="/unsubscribe" element={<PageTransition><NewsletterUnsubscribe /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ClickSpark
        sparkColor="#9A5A6E"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
      >
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
          <GlobalChat />
        </BrowserRouter>
      </ClickSpark>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
