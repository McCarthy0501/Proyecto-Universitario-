import { Truck, Shield, Award, Heart, Package, DollarSign } from 'lucide-react';

const Recomendacion = () => {
 const features = [
 {
 icon: <Truck className="w-8 h-8 text-blue-600" />,
 title: "Entrega Rapida",
 description: "Despachamos tus pedidos en menos de 24 horas en la zona metropolitana."
 },
 {
 icon: <Shield className="w-8 h-8 text-blue-600" />,
 title: "Calidad Garantizada",
 description: "Todos nuestros productos pasan por estrictos controles de calidad."
 },
 {
 icon: <Award className="w-8 h-8 text-blue-600" />,
 title: "Experiencia",
 description: "Mas de 15 anos como lideres en distribucion de productos."
 },
 {
 icon: <Heart className="w-8 h-8 text-blue-600" />,
 title: "Atencion Personalizada",
 description: "Asesoramiento experto para cada uno de nuestros clientes."
 },
 {
 icon: <Package className="w-8 h-8 text-blue-600" />,
 title: "Amplio Catalogo",
 description: "Mas de 500 productos disponibles para satisfacer tus necesidades."
 },
 {
 icon: <DollarSign className="w-8 h-8 text-blue-600" />,
 title: "Precios Competitivos",
 description: "Ofrecemos los mejores precios gracias a nuestra cadena de distribucion."
 }
 ];

 return (
 <section className="py-16 bg-gray-50">
 <div className="container mx-auto px-4">
 <div className="text-center mb-12">
 <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
 Por que elegir a <span className="text-blue-600">Distribuidora SalasSanchez1629</span>?
 </h2>
 <p className="text-lg text-gray-600 max-w-2xl mx-auto">
 Somos mas que un distribuidor, somos tu socio estrategico en el sumistro de productos de calidad.
 </p>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {features.map((feature, index) => (
 <div 
 key={index}
 className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
 >
 <div className="bg-blue-50 p-4 rounded-full mb-4">
 {feature.icon}
 </div>
 <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
 <p className="text-gray-600">{feature.description}</p>
 </div>
 ))}
 </div>
 
 <div className="mt-12 text-center">
 <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
 Conoce mas sobre nosotros
 </button>
 </div>
 </div>
 </section>
 );
};

export default Recomendacion;
