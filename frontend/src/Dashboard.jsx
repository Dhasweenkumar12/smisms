import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/dashboard')
      .then((response) => setStats(response.data))
      .catch((error) => console.error('Error fetching dashboard:', error));
  }, []);

  if (!stats) {
    return <p className="text-slate-400 text-sm">Loading dashboard...</p>;
  }

  const cards = [
    { label: 'Total Products', value: stats.total_products, icon: '📦', color: 'bg-blue-100 text-blue-600' },
    { label: 'Inventory Value', value: `₹${stats.total_value.toLocaleString('en-IN')}`, icon: '💰', color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Low Stock Items', value: stats.low_stock_count, icon: '⚠️', color: stats.low_stock_count > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className="text-xl font-bold text-slate-800">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;