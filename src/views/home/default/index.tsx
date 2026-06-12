// @ts-nocheck
import Navbar           from "components/home/Navbar";
import Hero             from "components/home/Hero";
import About            from "components/home/About";
import FounderSpeech    from "components/home/FounderSpeech";
import Stats            from "components/home/Stats";
import Programs         from "components/home/Programs";
import UpcomingPrograms from "components/home/UpcomingPrograms";
import Categories       from "components/home/Categories";
import HowToEnroll      from "components/home/HowToEnroll";
import HowToBeTrainer   from "components/home/HowToBeTrainer";
import Locations            from "components/home/Locations";
import Features             from "components/home/Features";
import ClientStrip          from "components/home/ClientStrip";
import TestimonialsSection  from "components/home/TestimonialsSection";
import Footer               from "components/home/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <FounderSpeech />
      <Stats />
      <Programs />
      <Categories />
      <UpcomingPrograms />
      <Features />
      <HowToEnroll />
      <HowToBeTrainer />
      <Locations />
      <ClientStrip />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default HomePage;
