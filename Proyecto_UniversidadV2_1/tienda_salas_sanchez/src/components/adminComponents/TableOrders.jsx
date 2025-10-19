import { useEffect,useState } from "react";

export default function TableOrders () {
    
    const [orders,setOrders]=useState([])
    useEffect(()=>{
        const solicitud= async () =>{
            const url="http://localhost:8000/api/orders"
            try {
                const respuesta=await fetch(url)
                const data=await respuesta.json()
                setOrders(data)
                
            } catch (e) {
                console.log("error en los datos", e); 
            }
        }
        solicitud()
    },[])
    return(<>
     <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Usuario</th>
            <th className="px-4 py-2 text-left">Metodo de Pago</th>
            <th className="px-4 py-2 text-left">N° de Orden</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Apellido</th>
            <th className="px-4 py-2 text-left">N° de Telefono</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Direccion 1 </th>
            <th className="px-4 py-2 text-left">Direccion 2</th>
            <th className="px-4 py-2 text-left">Pais</th>
            <th className="px-4 py-2 text-left">Ciudad</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Codigo Postal</th>
            <th className="px-4 py-2 text-left">Nota de la orden</th>
            <th className="px-4 py-2 text-left">Tax</th>
            <th className="px-4 py-2 text-left">Estado de la Orden</th>
            <th className="px-4 py-2 text-left">Ip</th>
            <th className="px-4 py-2 text-left">Is_order</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{order.user }</td>
                <td className="px-4 py-2">{order.payment }</td>
                <td className="px-4 py-2 max-w-xs truncate">{order.order_number}</td>
                <td className="px-4 py-2">{order. first_name}</td>
                <td className="px-4 py-2">{order.last_name}</td>
                <td className="px-4 py-2 max-w-xs truncate">{order.phone }</td>
                <td className="px-4 py-2">{order.email}</td>
                <td className="px-4 py-2">{order.address_line_1}</td>
                <td className="px-4 py-2 max-w-xs truncate">{order.address_line_2}</td>
                <td className="px-4 py-2">{order.country }</td>
                <td className="px-4 py-2 max-w-xs truncate">{order.city}</td>
                <td className="px-4 py-2">{order.state }</td>
                <td className="px-4 py-2 max-w-xs truncate">{order.order_note}</td>
                <td className="px-4 py-2">{order.order_total }</td>
                <td className="px-4 py-2 max-w-xs truncate">{order.tax}</td>
                <td className="px-4 py-2">{order.state }</td>
                <td className="px-4 py-2 max-w-xs truncate">{order.ip}</td>
                <td className="px-4 py-2 max-w-xs truncate">{order.is_ordered }</td>

               

               

               

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                No hay categorias disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>)
}