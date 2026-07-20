import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const isBookingPage = location.pathname.startsWith('/hall');

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__inner">
          <Link to="/" className="header__logo">
            Идём<span className="header__logo-thin">в</span>кино
          </Link>
          {!isBookingPage && (
            <Link to="/login" className="header__login-btn">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;