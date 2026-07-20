import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Client/Header';
import Index from './components/Client/Index';
import HallScheme from './components/Client/HallScheme';
import Login from './components/Client/Login';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');

  const showHeader = !isLoginPage && !isAdminPage;

  return (
    <div className="app">
      {showHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hall/:movieId" element={<HallScheme />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;