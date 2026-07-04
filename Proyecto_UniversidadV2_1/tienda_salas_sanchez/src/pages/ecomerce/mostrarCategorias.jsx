import Categorys from "../../components/main/categorys";
import Breadcrumb from "../../components/complementos/Breadcrumb";

function MostrarCategorys() {
    return(
        <>
        <Breadcrumb
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Categorías' },
          ]}
        />
        <Categorys/>
        </>
    )
    
}

export default MostrarCategorys
