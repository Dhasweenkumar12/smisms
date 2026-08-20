import { useState, useEffect } from 'react';
import axios from 'axios';

function Purchases({ token, products }) {
  const [purchases, setPurchases] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const fetchPurchases = () => {
    axios.get('http://127.0.0.1:8000/purchases')
      .then((response) => setPurchases(response.data))
      .catch((error) => console.error('Error fetching purchases:', error));
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/purchases', {
      product_id: parseInt(productId),
      quantity: parseInt(quantity),
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchPurchases();
        setProductId('');
        setQuantity('');
      })
      .catch((error) => console.error('Error creating purchase:', error));
  };

  const getProductName = (id) => {
    const product = products.find((p) => p.id === id);
    return product ? product.name : `Product #${id}`;
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-5 mb-8 flex flex-wrap gap-3 items-end"
      >
        <div className="flex flex-col">
          <label className="text-xs text-slate-500 mb-1">Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="border border-slate-300 rounded-md px-3 py-2 text-sm w-48"
          >
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-28">
          <label className="text-xs text-slate-500 mb-1">Quantity received</label>
          <input
            type="number"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors"
        >
          Log Purchase
        </button>
      </form>

      <div className="bg-white rounded-lg shadow divide-y divide-slate-100">
        {purchases.length === 0 && (
          <p className="p-5 text-sm text-slate-400">No purchases logged yet.</p>
        )}
        {purchases.map((purchase) => (
          <div key={purchase.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium text-slate-800">{getProductName(purchase.product_id)}</p>
              <p className="text-sm text-slate-500">
                {new Date(purchase.purchase_date).toLocaleString()}
              </p>
            </div>
            <span className="text-emerald-600 font-semibold text-sm">+{purchase.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Purchases;