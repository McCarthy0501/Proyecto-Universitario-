
import { useState,useEffect } from "react";





function Boton({ texto, className, type = "button" }) {
  const baseClasses="py-2 px-4 rounded ml-2";
    return (
      <>
        <button
          className={`${baseClasses} ${className}`}
          type={type}
        >
          {texto}
        </button>
      </>
    );
    
}

export default Boton