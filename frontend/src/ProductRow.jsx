import { useState } from 'react';

function ProductRow({ product, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: product.name,
    category: product.category,
    price: product.price,
    quantity: product.quantity,
  });

  const startEdit = () => {
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = () => {
    onUpdate(product.id, {
      name: editForm.name,
      category: editForm.category,
      price: parseFloat(editForm.price),
      quantity: parseInt(editForm.quantity),
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-wrap items-center gap-2 px-5 py-4 bg-blue-50">
        <input
          type="text"
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          className="border border-slate-300 rounded-md px-2 py-1 text-sm w-32"
        />
        <input
          type="text"
          value={editForm.category}
          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          className="border border-slate-300 rounded-md px-2 py-1 text-sm w-28"
        />
        <input
          type="number"
          value={editForm.price}
          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
          className="border border-slate-300 rounded-md px-2 py-1 text-sm w-20"
        />
        <input
          type="number"
          value={editForm.quantity}
          onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
          className="border border-slate-300 rounded-md px-2 py-1 text-sm w-16"
        />
        <button onClick={saveEdit} className="text-green-600 hover:text-green-800 text-sm font-medium">
          Save
        </button>
        <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-700 text-sm font-medium">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="font-medium text-slate-800">{product.name}</p>
        <p className="text-sm text-slate-500">
          {product.category} · ₹{product.price} · Qty: {product.quantity}
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={startEdit} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Edit
        </button>
        <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProductRow;