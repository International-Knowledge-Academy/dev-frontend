import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import AboutHero from "components/about/AboutHero";
import Mission from "components/about/Mission";
import Team from "components/about/Team";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <Navbar />
      <AboutHero />
      <Mission />
      <Team />
      <Footer />
    </div>
  );
};

export default AboutPage;
