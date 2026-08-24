import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { StructuredData } from "./components/layout/StructuredData";
import { WhatsAppFab } from "./components/layout/WhatsAppFab";
import { ContactForm } from "./components/sections/ContactForm";
import { Emobility } from "./components/sections/Emobility";
import { Engineering } from "./components/sections/Engineering";
import { Faq } from "./components/sections/Faq";
import { Hero } from "./components/sections/Hero";
import { Photovoltaic } from "./components/sections/Photovoltaic";
import { Process } from "./components/sections/Process";
import { Projects } from "./components/sections/Projects";
import { Simulators } from "./components/sections/Simulators";
import { Solutions } from "./components/sections/Solutions";
import { Storage } from "./components/sections/Storage";
import { SkipLink } from "./components/ui";
import { header } from "./data/content";

export default function App() {
  return (
    <>
      <StructuredData />
      <SkipLink href="#conteudo">{header.skipToContent}</SkipLink>
      <Header />

      <main id="conteudo">
        <Hero />
        <Projects />
        <Engineering />
        <Solutions />
        <Photovoltaic />
        <Storage />
        <Emobility />
        <Process />
        <Simulators />
        <Faq />
        <ContactForm />
      </main>

      <Footer />
      <WhatsAppFab />
    </>
  );
}
