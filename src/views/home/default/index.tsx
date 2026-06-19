// @ts-nocheck
import Navbar                from "components/home/Navbar";
import CampCarousel          from "components/home/camp/CampCarousel";
import CampTypesSection      from "components/home/camp/CampTypesSection";
import CampObjectivesSection from "components/home/camp/CampObjectivesSection";
import CampCurriculumSection from "components/home/camp/CampCurriculumSection";
import CampAdvantagesSection from "components/home/camp/CampAdvantagesSection";
import CampAudienceSection   from "components/home/camp/CampAudienceSection";
import CampWhyMalaysiaSection from "components/home/camp/CampWhyMalaysiaSection";
import CampRegisterCTA       from "components/home/camp/CampRegisterCTA";
import About                 from "components/home/About";
import FounderSpeech         from "components/home/FounderSpeech";
import Stats                 from "components/home/Stats";
import Programs              from "components/home/Programs";
import UpcomingPrograms      from "components/home/UpcomingPrograms";
import Categories            from "components/home/Categories";
import HowToEnroll           from "components/home/HowToEnroll";
import HowToBeTrainer        from "components/home/HowToBeTrainer";
import Features              from "components/home/Features";
import Locations             from "components/home/Locations";
import Partnerships          from "components/home/Partnerships";
import TestimonialsSection   from "components/home/TestimonialsSection";
import WhatsAppFloatButton   from "components/home/WhatsAppFloatButton";
import Footer                from "components/home/Footer";

const HomePage = () => {
  return (
    <div className="w-full flex flex-col">
      <Navbar />

      {/* ── HOOK ───────────────────────────────── */}
      <CampCarousel />

      {/* ── WHO WE ARE ─────────────────────────── */}
      <About />
      <Stats />
      <FounderSpeech />

      {/* ── CAMP DEEP-DIVE ─────────────────────── */}
      <CampTypesSection />
      <CampAudienceSection />
      <CampObjectivesSection />
      <CampCurriculumSection />
      <CampWhyMalaysiaSection />
      <CampAdvantagesSection />

      {/* ── TRAINING PROGRAMMES ────────────────── */}
      <Programs />
      <Categories />
      <UpcomingPrograms />

      {/* ── DIFFERENTIATORS ────────────────────── */}
      <Features />

      {/* ── SOCIAL PROOF ───────────────────────── */}
      <TestimonialsSection />
      <Partnerships />
      <Locations />

      {/* ── PROCESS ────────────────────────────── */}
      <HowToEnroll />
      <HowToBeTrainer />

      {/* ── CONVERT ────────────────────────────── */}
      <CampRegisterCTA />

      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
};

export default HomePage;
