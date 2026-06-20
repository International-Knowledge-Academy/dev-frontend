// @ts-nocheck
import Navbar                from "components/home/Navbar";
import CarouselHero          from "components/home/CarouselHero";
import About                 from "components/home/About";
import FounderSpeech         from "components/home/FounderSpeech";
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
      <CarouselHero />

      {/* ── WHO WE ARE ─────────────────────────── */}
      <About />
      <FounderSpeech />

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

      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
};

export default HomePage;
