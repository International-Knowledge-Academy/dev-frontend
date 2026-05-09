// @ts-nocheck
import Navbar           from "components/home/Navbar";
import Hero             from "components/home/Hero";
import About            from "components/home/About";
import Stats            from "components/home/Stats";
import Programs         from "components/home/Programs";
import UpcomingPrograms from "components/home/UpcomingPrograms";
import TrainingFields   from "components/home/TrainingFields";
import HowToEnroll      from "components/home/HowToEnroll";
import HowToBeTrainer   from "components/home/HowToBeTrainer";
import Locations        from "components/home/Locations";
import Features         from "components/home/Features";
import Footer           from "components/home/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Stats />
      <Programs />
      <UpcomingPrograms />
      <TrainingFields />
      <HowToEnroll />
      <HowToBeTrainer />
      <Locations />
      <Features />
      <Footer />
    </div>
  );
};

export default HomePage;
