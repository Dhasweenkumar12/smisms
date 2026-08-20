function Sidebar({ onLogout, currentPage, onNavigate }) {
  const navItems = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Products', icon: '📦' },
    { label: 'Low Stock', icon: '⚠️' },
  ];

  return (
    <aside className="w-60 bg-slate-900 text-slate-300 min-h-screen flex flex-col p-4">
      <div className="mb-8 px-2">
        <h1 className="text-white font-bold text-lg">SMISMS</h1>
        <p className="text-xs text-slate-500">Inventory Management</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <div
            key={item.label}
            onClick={() => onNavigate(item.label)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
              currentPage === item.label
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="text-sm text-slate-400 hover:text-white text-left px-3 py-2 mt-auto"
      >
        🚪 Log out
      </button>
    </aside>
  );
}

export default Sidebar;