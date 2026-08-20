import { useState } from 'react';

function ProductForm({ onAdd, suppliers }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplierId, setSupplierId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      supplier_id: supplierId ? parseInt(supplierId) : null,
    });
    setName('');
    setCategory('');
    setPrice('');
    setQuantity('');
    setSupplierId('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-5 mb-8 flex flex-wrap gap-3 items-end"
    >
      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Product name</label>
        <input
          type="text"
          placeholder="e.g. Dell Laptop"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Category</label>
        <input
          type="text"
          placeholder="e.g. Electronics"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col w-28">
        <label className="text-xs text-slate-500 mb-1">Price (₹)</label>
        <input
          type="number"
          placeholder="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col w-24">
        <label className="text-xs text-slate-500 mb-1">Qty</label>
        <input
          type="number"
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Supplier</label>
        <select
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm w-40"
        >
          <option value="">None</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors"
      >
        Add Product
      </button>
    </form>
  );
}

export default ProductForm;