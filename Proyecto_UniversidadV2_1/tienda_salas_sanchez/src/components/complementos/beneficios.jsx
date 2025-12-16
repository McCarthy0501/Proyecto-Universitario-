function Benefits() {
  const items = [
    {
      id: 1,
      icon: "🚚",
      title: "Envío rápido",
      description: "Recibe tus pedidos en 24-48 horas",
    },
    {
      id: 2,
      icon: "💰",
      title: "Garantía de devolución",
      description: "Si no te gusta, te devolvemos el dinero",
    },
    {
      id: 3,
      icon: "📞",
      title: "Soporte 24/7",
      description: "Estamos para ayudarte en todo momento",
    },
  ];

  return (
    <div className="py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1  sm:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Benefits;
