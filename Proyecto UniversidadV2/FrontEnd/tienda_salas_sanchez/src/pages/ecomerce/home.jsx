import MostrarCategorys from "./mostrarCategorias";
import Hero from"../../components/hero"
import SimpleSlider from "../../components/sliderProducts";
import Benefits from "../../components/beneficios";
import Testimonials from "../../components/testimonios";
import Newsletter from "../../components/NewLetter";



function Home() {
    return (
      <>
        <div  className="flex flex-col items-center space-y-10 p-4 md:p-8 max-w-7xl mx-auto">
          <Hero />
          <SimpleSlider />
          <MostrarCategorys />
          <div className="space-y-12">
            <Testimonials />
          </div>  
          <Newsletter/>
          <Benefits />
        </div>
      </>
    );
    
}

export default Home