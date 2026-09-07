import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function Suppliers({ token }) {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const fetchSuppliers = () => {
    axios.get(`${API_URL}/suppliers`)
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error('Error fetching suppliers:', error));
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${API_URL}/suppliers`, {
      name,
      contact_email: email || null,
      phone: phone || null,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchSuppliers();
        setName('');
        setEmail('');
        setPhone('');
      })
      .catch((error) => console.error('Error creating supplier:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/suppliers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchSuppliers())
      .catch((error) => console.error('Error deleting supplier:', error));
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-5 mb-8 flex flex-wrap gap-3 items-end"
      >
        <div className="flex flex-col">
          <label className="text-xs text-slate-500 mb-1">Supplier name</label>
          <input
            type="text"
            placeholder="e.g. ABC Traders"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-slate-300 rounded-md px-3 py-2 text-sm w-40"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-slate-500 mb-1">Email (optional)</label>
          <input
            type="email"
            placeholder="contact@supplier.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm w-48"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-slate-500 mb-1">Phone (optional)</label>
          <input
            type="text"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm w-36"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors"
        >
          Add Supplier
        </button>
      </form>

      <div className="bg-white rounded-lg shadow divide-y divide-slate-100">
        {suppliers.length === 0 && (
          <p className="p-5 text-sm text-slate-400">No suppliers added yet.</p>
        )}
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium text-slate-800">{supplier.name}</p>
              <p className="text-sm text-slate-500">
                {supplier.contact_email || 'No email'} - {supplier.phone || 'No phone'}
              </p>
            </div>
            <button
              onClick={() => handleDelete(supplier.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suppliers;
