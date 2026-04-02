// @ts-nocheck
import Navbar from "components/home/Navbar";
import Hero from "components/home/Hero";
import TaskCard from "components/home/TaskCard";
import Features from "components/home/Features";
import Footer from "components/home/Footer";

import { MdInbox } from "react-icons/md";


const HomePage = () => {
  return (
    <div className="h-[100vh]">
      <Navbar/>
      <Hero/>
      <Features/>
      <TaskCard/>
      <Footer/>
    </div>
  );
};

export default HomePage;
