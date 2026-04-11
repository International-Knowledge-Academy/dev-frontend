// @ts-nocheck
import Navbar from "components/home/Navbar";
import Hero from "components/home/Hero";
import About from "components/home/About";
import Stats from "components/home/Stats";
import Programs from "components/home/Programs";
import TrainingFields from "components/home/TrainingFields";
import Locations from "components/home/Locations";
import Features from "components/home/Features";
import CTA from "components/home/CTA";
import Footer from "components/home/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Stats />
      <Programs />
      <TrainingFields />
      <Locations />
      <Features />
      {/* <CTA /> */}
      <Footer />
    </div>
  );
};

export default HomePage;
