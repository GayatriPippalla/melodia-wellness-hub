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

const Index = () => (
  <div className="min-h-screen bg-background">
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
);

export default Index;
