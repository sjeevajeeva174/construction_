import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Blueprint } from "@/components/sections/Blueprint";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { Materials } from "@/components/sections/Materials";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Blueprint />
      <Process />
      <Services />
      <Gallery />
      <Materials />
      <Testimonials />
      <Contact />
    </>
  );
}
