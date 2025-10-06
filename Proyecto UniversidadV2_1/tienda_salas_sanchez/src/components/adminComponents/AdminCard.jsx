import React from 'react';

function AdminCard({ name, role, avatar }) {
  return (
    <div className="max-w-xs bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 flex items-center space-x-4">
      {/* Foto de usuario */}
      <img 
        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" 
        src={avatar} 
        alt={`${name} avatar`} 
      />
      
      {/* Información del usuario */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}

export default AdminCard;
