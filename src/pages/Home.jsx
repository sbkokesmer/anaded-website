import Hero from "../components/sections/Hero";
import Stats from "../components/sections/Stats";
import About from "../components/sections/About";
import Services from "../components/sections/Services";
import Activities from "../components/sections/Activities";
import Partners from "../components/sections/Partners";
import CTA from "../components/sections/CTA";
import Contact from "../components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Services />
      <Activities />
      <Partners limit={3} showMore />
      <CTA />
      <Contact />
    </>
  );
}
