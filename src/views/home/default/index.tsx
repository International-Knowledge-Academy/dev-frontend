// @ts-nocheck
import Navbar              from "components/home/Navbar";
import Hero                from "components/home/Hero";
import About               from "components/home/About";
import FounderSpeech       from "components/home/FounderSpeech";
import Stats               from "components/home/Stats";
import Programs            from "components/home/Programs";
import Services            from "components/home/Services";
import UpcomingPrograms    from "components/home/UpcomingPrograms";
import Categories          from "components/home/Categories";
import HowToEnroll         from "components/home/HowToEnroll";
import HowToBeTrainer      from "components/home/HowToBeTrainer";
import Features            from "components/home/Features";
import Locations           from "components/home/Locations";
import Partnerships        from "components/home/Partnerships";
import TestimonialsSection from "components/home/TestimonialsSection";
import WhatsAppFloatButton from "components/home/WhatsAppFloatButton";
import Footer              from "components/home/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <FounderSpeech />
      <Stats />
      <Programs />
      <Services />
      <Categories />
      <UpcomingPrograms />
      <Features />
      <HowToEnroll />
      <HowToBeTrainer />
      <Locations />
      <Partnerships />
      <TestimonialsSection />
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
};

export default HomePage;
