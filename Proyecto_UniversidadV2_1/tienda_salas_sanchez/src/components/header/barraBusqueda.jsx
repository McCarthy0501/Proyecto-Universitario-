import Boton from "../complementos/boton";




function BarraBusqueda() {
    return (
      <>
        <div className="w-full md:flex-grow md:mx-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full p-2 rounded text-white"
            />
            <Boton
              texto="🔍"
              className="bg-blue-500 hover:bg-blue-700 text-white ml-2"
              type="submit"
            />
          </div>
        </div>
      </>
    );
    
}

export default BarraBusqueda