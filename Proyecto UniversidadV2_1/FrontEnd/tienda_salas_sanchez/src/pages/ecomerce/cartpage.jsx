import ShopingCart from "../../components/shopingCart";

function CartPage() {
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Página del Carrito de Compras</h1>
      <p className="mt-4 text-gray-600">Aquí se mostrarán los productos que has agregado.</p>
    </div>
  );
    
}

export default CartPage