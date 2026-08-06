import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

function AddSeancePopup({ onClose, preSelectedHallId, preSelectedFilmId, onAddSeance }) {
  const { halls, films } = useData();
  const [hallId, setHallId] = useState(preSelectedHallId || '');
  const [filmId, setFilmId] = useState(preSelectedFilmId || '');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (preSelectedHallId) setHallId(preSelectedHallId);
    if (preSelectedFilmId) setFilmId(preSelectedFilmId);
  }, [preSelectedHallId, preSelectedFilmId]);

  const handleSubmit = () => {
    if (!hallId || !filmId || !time.trim()) return;
    if (!/^\d{2}:\d{2}$/.test(time)) {
      alert('Введите время в формате HH:MM');
      return;
    }
    onAddSeance(hallId, filmId, time);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup" style={{ minHeight: 380 }}>
        <header className="popup__header">
          <h2 className="popup__title">Добавление сеанса</h2>
          <button className="popup__close" onClick={onClose}>
            <img src="public/IconClose.png" alt="Закрыть" />
          </button>
        </header>
        <div className="popup__form">
          <div className="popup__field">
            <label className="popup__label">Название зала</label>
            <select
              className="popup__input popup__select"
              value={hallId}
              onChange={(e) => setHallId(e.target.value)}
            >
              <option value="">Выберите зал</option>
              {halls.map((hall) => (
                <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
              ))}
            </select>
          </div>
          <div className="popup__field">
            <label className="popup__label">Название фильма</label>
            <select
              className="popup__input popup__select"
              value={filmId}
              onChange={(e) => setFilmId(e.target.value)}
            >
              <option value="">Выберите фильм</option>
              {films.map((film) => (
                <option key={film.id} value={film.id}>{film.film_name}</option>
              ))}
            </select>
          </div>
          <div className="popup__field">
            <label className="popup__label">Время начала</label>
            <input
              className="popup__input"
              type="time"
              placeholder="00:00"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="popup__buttons">
            <button className="popup__button popup__button--primary" onClick={handleSubmit}>
              Добавить сеанс
            </button>
            <button className="popup__button popup__button--secondary" onClick={onClose}>
              Отменить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSeancePopup;