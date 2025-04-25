import React, { useState, useEffect } from 'react';

export default function HoursReportReact({ fecha }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (fecha) => {
    try {
      const res = await fetch(`/links/employee_hours/${fecha}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(fecha);
  }, [fecha]);

  return (
    <div className="reporte-horas">
      {/* Mantener tu estructura de tabla existente */}
      <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Empleado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Horas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={`${item.id}-${item.date}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{item.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100">
                    {item.horas.toFixed(2)} hrs
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}