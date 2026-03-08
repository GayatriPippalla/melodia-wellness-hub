import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import DailyMotivation from "@/components/DailyMotivation";
import WellnessAssessment from "@/components/WellnessAssessment";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <About />
    <Services />
    <DailyMotivation />
    <WellnessAssessment />
    <Contact />
    <Footer />
  </div>
);

export default Index;
