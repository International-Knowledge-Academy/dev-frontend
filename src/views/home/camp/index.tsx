// @ts-nocheck
import Navbar from "components/home/Navbar";
import Footer from "components/home/Footer";
import CampHero from "components/home/CampHero";
import CampTypesSection from "components/home/camp/CampTypesSection";
import CampObjectivesSection from "components/home/camp/CampObjectivesSection";
import CampCurriculumSection from "components/home/camp/CampCurriculumSection";
import CampExperiencesSection from "components/home/camp/CampExperiencesSection";
import CampAdvantagesSection from "components/home/camp/CampAdvantagesSection";
import CampAudienceSection from "components/home/camp/CampAudienceSection";
import CampWhyMalaysiaSection from "components/home/camp/CampWhyMalaysiaSection";
import CampRegisterCTA from "components/home/camp/CampRegisterCTA";

const CampPage = () => {
  return (
    <>
      <Navbar />
      <CampHero />
      <CampTypesSection />
      <CampObjectivesSection />
      <CampCurriculumSection />
      <CampExperiencesSection />
      <CampAdvantagesSection />
      <CampAudienceSection />
      <CampWhyMalaysiaSection />
      <CampRegisterCTA />
      <Footer />
    </>
  );
};

export default CampPage;
