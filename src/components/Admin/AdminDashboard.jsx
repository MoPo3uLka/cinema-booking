import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import HallEditor from './HallEditor';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* Шапка как в Login */}
      <header className="login-page__header">
          <Link to="/" className="header__logo">
            Идём<span className="header__logo-thin">в</span>кино
          </Link>
        <div className="login-page__subtitle">Администраторррская</div>
      </header>

      <div className="admin-content">
        <Routes>
          <Route path="halls" element={<HallEditor />} />
          <Route index element={<HallEditor />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;