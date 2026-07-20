import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // ← Link обязателен!
import { useData } from '../../contexts/DataContext';

function Login() {
  const { login } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Ошибка авторизации');
    }
  };

  return (
    <div className="login-page">
      <header className="login-page__header">
          <Link to="/" className="header__logo">
            Идём<span className="header__logo-thin">в</span>кино
          </Link>
        <div className="login-page__subtitle">Администраторррская</div>
      </header>

      <section className="login-page__container">
        <div className="login-page__form-header">
          <h2 className="login-page__form-title">Авторизация</h2>
        </div>

        <form className="login-page__form" onSubmit={handleSubmit}>
          <div className="login-page__field">
            <label className="login-page__label">E-mail</label>
            <input
              className="login-page__input"
              type="text"
              placeholder="example@domain.xyz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-page__field">
            <label className="login-page__label">Пароль</label>
            <input
              className="login-page__input"
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-page__error">{error}</div>}

          <div className="login-page__button-wrapper">
            <button type="submit" className="login-page__button">
              Авторизоваться
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;