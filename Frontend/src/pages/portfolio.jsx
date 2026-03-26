// pages/Portfolio.jsx
import { useEffect } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import FloatingNav from "../components/FloatingNav";
import ThemeToggle from "../components/ThemeToggle";
import DevModeToggle from "../components/DevMode";

// Your existing sections
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ContactSection from "../components/ContactSection";

export default function Portfolio() {
  // Enable scroll animations
  useScrollReveal();

  // Smooth scrolling for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <>
      {/* Floating nav and toggles */}
      <FloatingNav />
      <ThemeToggle />
      <DevModeToggle />

      {/* Main portfolio content */}
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