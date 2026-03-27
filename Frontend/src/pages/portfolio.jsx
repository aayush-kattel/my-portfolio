import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
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
  const [refreshKey, setRefreshKey] = useState(0);
  const location   = useLocation();
  const isFirstRender = useRef(true);          // ← skip the initial mount trigger

  useScrollReveal();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;           // ← first render, skip
      return;
    }
    setRefreshKey(k => k + 1);                 // ← only fires on real navigations back to "/"
  }, [location.key]);

  return (
    <>
      <FloatingNav />
      <ThemeToggle />
      <DevModeToggle onClose={() => setRefreshKey(k => k + 1)} />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection key={refreshKey} />
        <ContactSection />
      </main>
    </>
  );
}