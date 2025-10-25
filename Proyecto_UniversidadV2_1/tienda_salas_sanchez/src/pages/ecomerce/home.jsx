import { motion } from "framer-motion"; // librerias de react para animaciones
import MostrarCategorys from "./mostrarCategorias";
import Hero from "../../components/hero";
import SimpleSlider from "../../components/sliderProducts";
import Benefits from "../../components/beneficios";
import Testimonials from "../../components/testimonios";
import Newsletter from "../../components/NewLetter";
import OfferBanner from "../../components/OffertCard";
import BrandStatement from "../../components/BrandStatement";
import TopSellingProducts from "../../components/ProductsTop";

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
     

<main className="flex flex-col items-center space-y-12 p-4 sm:p-6 md:p-8 max-w-[80rem] mx-auto">
    
    {/* 1. SIMPLE SLIDER (HERO) - Debe aparecer de inmediato */}
    <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        // Aparece casi inmediatamente al cargar (viewport: 0.1)
        viewport={{ once: true, amount: 0.1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} // Sin delay
        className="w-full"
    >
        <SimpleSlider />
    </motion.div>

    {/* 2. BENEFITS - Aparece justo después del Hero (Confianza Inmediata) */}
    <motion.div
        variants={fadeUp} // Entrada desde abajo
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }} // Pequeño delay
        className="w-full"
    >
        <Benefits />
    </motion.div>

    {/* 3. OFFER BANNER - CTA Fuerte, usa fadeDown para un contraste visual con Benefits */}
    <motion.div
        variants={fadeDown} // Entrada desde arriba
        initial="desaparece" 
        whileInView="aparece" 
        viewport={{ once: true, amount: 0.5 }} 
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} // Sigue el flujo
        className="w-full"
    >
        <OfferBanner/>
    </motion.div>
    
    {/* 4. MOSTRAR CATEGORIAS - Guía, entrada lateral izquierda */}
    <motion.div
        variants={fadeLef}
        initial="desaparece"
        whileInView="aparece"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="w-full"
    >
        <MostrarCategorys />
    </motion.div>

    {/* 5. TOP SELLING PRODUCTS - Productos, entrada desde abajo (visualización del grid) */}
    <motion.div
        variants={fadeUp} 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="w-full"
    >
        <TopSellingProducts/>
    </motion.div>

    {/* 6. TESTIMONIALS - Prueba Social, entrada lateral derecha */}
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

    {/* 7. BRAND STATEMENT - Bloque de SEO/Marca, entrada desde abajo */}
    <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        className="w-full"
    >
        <BrandStatement/>
    </motion.div>

    {/* 8. NEWSLETTER - Cierre final, entrada desde arriba */}
    <motion.div
        variants={fadeDown}
        initial="desaparece"
        whileInView="aparece"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
        className="w-full"
    >
        <Newsletter />
    </motion.div>
    
</main>
    </>
  );
}
