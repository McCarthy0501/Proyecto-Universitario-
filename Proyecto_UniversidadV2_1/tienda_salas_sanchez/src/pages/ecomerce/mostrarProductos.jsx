import Productos  from"../../components/main/products"
import Breadcrumb from "../../components/complementos/Breadcrumb"

function MostrarProductos() {
    return(
        <>
        <Breadcrumb
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Productos' },
          ]}
        />
        <Productos/>
        </>
    )
    
}
export default MostrarProductos
