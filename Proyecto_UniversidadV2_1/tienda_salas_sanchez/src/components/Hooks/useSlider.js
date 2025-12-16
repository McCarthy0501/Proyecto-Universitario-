import { useState } from "react";
import { slides } from "../logic/main/siler";

export const useSlider = ()=>{

const [currentIndex, setCurrentIndex] = useState(0);

const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

 const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  //retornamos las variables a usar en el componente
return{
    currentIndex,
    setCurrentIndex,
    nextSlide,
    prevSlide,
    slides
}
}