import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Mission from "@/components/Mission";
import Services from "@/components/Services";
import DailyMotivation from "@/components/DailyMotivation";
import WellnessAssessment from "@/components/WellnessAssessment";
import CallToAction from "@/components/CallToAction";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { BackgroundPaths } from "@/components/ui/background-paths";

const Index = () => (
  <div className="relative bg-background min-h-screen">
    <div className="absolute inset-0 z-0 h-[100vh] overflow-hidden pointer-events-none opacity-40">
      <BackgroundPaths />
    </div>
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Mission />
      <Services />
      <DailyMotivation />
      <WellnessAssessment />
      <Testimonials />
      <CallToAction />
      <Contact />
      <Footer />
    </div>
  </div>
);

export default Index;
