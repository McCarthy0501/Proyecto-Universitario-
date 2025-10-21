import logo     from '../assets/imagenes/SalasSanchez1629.png'
import logoForm from'../assets/imagenes/SalasSanchez1629_forms.png'




function Logo() {
    return(
        <>
       
        <img src={logo} alt="" className=" h-40 w-auto" />
       
        
        </>
    )
    
}

function LogoForm(){
    return (
      <>
        
          <img src={logoForm} alt="" className=" h-40 w-auto" />
        
      </>
    )
}

export { Logo, LogoForm };