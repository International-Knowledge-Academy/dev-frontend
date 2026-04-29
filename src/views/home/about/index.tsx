// @ts-nocheck
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import AboutHero from "components/about/AboutHero";
import History from "components/about/History";
import Mission from "components/about/Mission";
import TargetAudience from "components/about/TargetAudience";
import Team from "components/about/Team";
import Certifications from "components/about/Certifications";
import WorldMapSection from "components/home/WorldMapSection";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <AboutHero />
      <History />
      <Mission />
      <TargetAudience />
      <Team />
      <Certifications />
      <WorldMapSection />
      <Footer />
    </div>
  );
};

export default AboutPage;
