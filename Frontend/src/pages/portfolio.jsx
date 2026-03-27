import { useEffect } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import FloatingNav from "../components/FloatingNav";
import ThemeToggle from "../components/ThemeToggle";
import DevModeToggle from "../components/DevMode";

import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ContactSection from "../components/ContactSection";

export default function Portfolio() {
  useScrollReveal();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <>
      <FloatingNav />
      <ThemeToggle />
      <DevModeToggle />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}