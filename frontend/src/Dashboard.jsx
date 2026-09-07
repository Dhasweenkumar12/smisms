import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function Dashboard({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/dashboard`)
      .then((response) => setStats(response.data))
      .catch((error) => console.error('Error fetching dashboard:', error));
  }, []);

  if (!stats) {
    return <p className="text-slate-400 text-sm">Loading dashboard...</p>;
  }

  const cards = [
    { label: 'Total Products', value: stats.total_products, icon: '01', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Inventory Value', value: `Rs.${stats.total_value.toLocaleString('en-IN')}`, icon: '02', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Low Stock Items', value: stats.low_stock_count, icon: '03', color: stats.low_stock_count > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
