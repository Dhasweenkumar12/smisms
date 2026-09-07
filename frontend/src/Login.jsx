import { useState } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    axios.post(`${API_URL}/login`, { email, password })
      .then((response) => {
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        onLoginSuccess(token);
      })
      .catch((err) => {
        if (err.response) {
          setError('Invalid email or password');
        } else {
          setError('Cannot reach server - is the backend running?');
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow w-80 flex flex-col gap-3"
      >
        <h1 className="text-xl font-bold text-slate-800 mb-2">SMISMS Login</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-slate-300 rounded-md px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
