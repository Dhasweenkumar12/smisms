import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Dashboard from './Dashboard';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import Sidebar from './Sidebar';
import LowStock from './LowStock';
import Purchases from './Purchases';
import Suppliers from './Suppliers';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const fetchProducts = (search = '', category = '') => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;

    axios.get('http://127.0.0.1:8000/products', { params })
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/categories')
        .then((response) => setCategories(response.data))
        .catch((error) => console.error('Error fetching categories:', error));
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/suppliers')
        .then((response) => setSuppliers(response.data))
        .catch((error) => console.error('Error fetching suppliers:', error));
    }
  }, [token]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    fetchProducts(value, selectedCategory);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    fetchProducts(searchTerm, value);
  };

  const handleAdd = (newProduct) => {
    axios.post('http://127.0.0.1:8000/products', newProduct, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchProducts(searchTerm, selectedCategory))
      .catch((error) => console.error('Error creating product:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchProducts(searchTerm, selectedCategory))
      .catch((error) => console.error('Error deleting product:', error));
  };

  const handleUpdate = (id, updatedProduct) => {
    axios.put(`http://127.0.0.1:8000/products/${id}`, updatedProduct, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchProducts(searchTerm, selectedCategory))
      .catch((error) => console.error('Error updating product:', error));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <Login onLoginSuccess={(newToken) => setToken(newToken)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar onLogout={handleLogout} currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{currentPage}</h1>
              <p className="text-sm text-slate-500">Welcome back 👋</p>
            </div>
          </div>

          {currentPage === 'Dashboard' && <Dashboard token={token} />}

          {currentPage === 'Products' && (
            <>
              <ProductForm onAdd={handleAdd} suppliers={suppliers} />
              <ProductList
                products={products}
                categories={categories}
                suppliers={suppliers}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </>
          )}

          {currentPage === 'Low Stock' && <LowStock />}

          {currentPage === 'Purchases' && <Purchases token={token} products={products} />}

          {currentPage === 'Suppliers' && <Suppliers token={token} />}
        </div>
      </main>
    </div>
  );
}

export default App;