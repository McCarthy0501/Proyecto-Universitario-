import { motion } from "framer-motion"; // librerias de react para animaciones
import MostrarCategorys from "./mostrarCategorias";
import Hero from "../../components/hero";
import SimpleSlider from "../../components/sliderProducts";
import Benefits from "../../components/beneficios";
import Testimonials from "../../components/testimonios";
import Newsletter from "../../components/NewLetter";
import OfferBanner from "../../components/OffertCard";

// Variante común para todos los bloques
const fadeUp = {
  hidden: { opacity: 0, y: 50 },    
  visible: { opacity: 1, y: 0 },    
};
const fadeLef={
  desaparece:{opacity:0, x:-50},
  aparece:{opacity:1, x:0},
}

const fadeRight={
  desaparece:{opacity:0, x:50},
  aparece:{opacity:1, x:0},
}

const fadeDown={
  desaparece:{opacity:0, y:-50},
  aparece:{opacity:1, y:0},
}

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center space-y-10 p-4 md:p-8 max-w-7xl mx-auto">

        <motion.div
          variants={fadeDown} //condiciones de la animacion
          initial="desaparece" //estado inicial 
          whileInView="aparece" // estado final
          viewport={{ once: true, amount: 0.5 }} //indica que cuando el componete esta en mas del 50 % ya dentro del Dom es que aparecera 
          transition={{ duration: 0.8, ease: "easeOut" }} // duracion  y tipo de animacion
          className="w-full"
        >
          <OfferBanner/>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="w-full"
        >
          <SimpleSlider />
        </motion.div>

        <motion.div
          variants={fadeLef}
          initial="desaparece"
          whileInView="aparece"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="w-full"
        >
          <MostrarCategorys />
        </motion.div>

        <motion.div
          variants={fadeRight}
          initial="desaparece"
          whileInView="aparece"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="w-full"
        >
          <Testimonials />
        </motion.div>

        <motion.div
          variants={fadeDown}
          initial="desaparece"
          whileInView="aparece"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="w-full"
        >
          <Newsletter />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="w-full"
        >
          <Benefits />
        </motion.div>

      </main>
    </>
  );
}
