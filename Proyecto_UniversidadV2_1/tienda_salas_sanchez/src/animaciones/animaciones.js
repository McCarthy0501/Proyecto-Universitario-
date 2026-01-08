
// Variante común para todos los bloques
export const fadeUp = {
  hidden: { opacity: 0, y: 50 },    
  visible: { opacity: 1, y: 0 },    
};
export const fadeLef={
  desaparece:{opacity:0, x:-50},
  aparece:{opacity:1, x:0},
}

export const fadeRight={
  desaparece:{opacity:0, x:50},
  aparece:{opacity:1, x:0},
}

export const fadeDown={
  desaparece:{opacity:0, y:-50},
  aparece:{opacity:1, y:0},
}