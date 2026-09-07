import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function LowStock() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/products/low-stock`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching low stock:', error));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-slate-100">
      {products.length === 0 && (
        <p className="p-5 text-sm text-slate-400">No low stock items.</p>
      )}
      {products.map((product) => (
        <div key={product.id} className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-medium text-slate-800">{product.name}</p>
            <p className="text-sm text-slate-500">{product.category} - Rs.{product.price}</p>
          </div>
          <span className="text-red-600 font-semibold text-sm">Qty: {product.quantity}</span>
        </div>
      ))}
    </div>
  );
}

export default LowStock;
