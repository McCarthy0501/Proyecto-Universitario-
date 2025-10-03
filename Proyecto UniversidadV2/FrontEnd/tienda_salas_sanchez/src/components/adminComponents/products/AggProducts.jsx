import { useState,useEffect } from "react";
import { LogoForm } from "../../logo";
function AggProducts() {
   const [categoria,setCategoria]=useState([]);
    const [error, setError] = useState("");
    //campos del formulario en su estado inicial
    const [data,setData]=useState(
        {
        product_name: '',
        description: '',
        slug: '',
        price: '',
        images:null,
        stock:'',
        category:''
        }

    )
   
//categorias
     useEffect(()=>{
        const peticion=async()=>{
            const url ="http://localhost:8000/api/categorias"
            try {
                const consulta= await fetch(url)
                const data= await consulta.json()
                setCategoria(data)
                
            } catch (e) {
              console.log("error en los datos", e); //capturamos los errores
            }
        };
        peticion()
    },[])
//captura de valores del formulario
    const captura= (e)=>{
        const { name, value,type, files } = e.target;
        if (type === "file") {
          setData({ ...data, [name]: e.target.files[0] }); // captura la foto
          } else {
            setData({ ...data, [name]: e.target.value });
          }

    }

    const productSubmit=async (e)=>{
      e.preventDefault();
      setError("");
      const formdata= new FormData();
      formdata.append("product_name",data.product_name)
      formdata.append("slug",data.slug)
      formdata.append("description",data.description)
      formdata.append("price",data.price)
      formdata.append("images",data.images)
      formdata.append("stock",data.stock)
      formdata.append("category",data.category)
      const url="http://localhost:8000/api/admin/aggProduct/"
      try {
        const solicitud= await fetch(url,{
            method: "POST",
           //cuando hay imagenes o archivos de por medio se coloca asi nada de json al enviar
            body: formdata,
          });
          if(!solicitud.ok){
            new console.error("error al crear el producto");
            alert("Error al Crear el Producto")
            
          }const resultado=await solicitud.json();
          console.log("Respuesta del backend:", resultado);
          alert("Producto creado con exito")
      } catch (e) {
        console.error("Error en la petición:", e);
        setError("Error al crear el producto Verifica tus datos.");
        
      }



        
    }
    return (
      <>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center mb-6">
              {/* Logo de la empresa */}
              <a href="/admin">
                {" "}
                <LogoForm
                  alt="Logo de la Empresa"
                  className="w-20 h-20 mb-2"
                />{" "}
              </a>
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Crea un Producto
              </h2>
            </div>

            <form className="space-y-4" onSubmit={productSubmit}>
              {/* nombre de la categoria */}
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <input
                  type="text"
                  name="product_name"
                  placeholder="Nombre "
                  value={data.product_name}
                  onChange={captura}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="slug"
                  placeholder="slug"
                  value={data.slug}
                  onChange={captura}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/*  description */}

              <textarea
                type="text"
                name="description"
                placeholder="Descripción del Producto"
                value={data.description}
                onChange={captura}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* imagen */}
              <input
                type="file"
                name="images"
                placeholder="Imagen"
                
                onChange={captura}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* precio */}
              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={data.price}
                onChange={captura}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* stock */}
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={data.stock}
                onChange={captura}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* categorias  */}
              <select
                name="category"
                placeholder="categoria"
                value={data.category}
                onChange={captura}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona la categoría</option>
                {categoria.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Producto
              </button>
            </form>
          </div>
        </div>
      </>
    );
    
}
export default AggProducts