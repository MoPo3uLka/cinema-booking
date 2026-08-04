import { useState, useRef } from 'react';
import { useData } from '../../contexts/DataContext';

function AddFilmPopup({ onClose }) {
  const { addFilm } = useData();
  const [filmName, setFilmName] = useState('');
  const [filmDuration, setFilmDuration] = useState('');
  const [filmDescription, setFilmDescription] = useState('');
  const [filmOrigin, setFilmOrigin] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddFilm = () => {
    if (!filmName.trim() || !filmDuration) return;
    addFilm(filmName, filmDuration, filmDescription, filmOrigin, posterFile);
    onClose();
  };

  const handlePosterClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    setPosterFile(e.target.files[0]);
  };

  return (
    <div className="popup-overlay">
      <div className="popup" style={{ minHeight: 484 }}>
        <header className="popup__header">
          <h2 className="popup__title">Добавление фильма</h2>
          <button className="popup__close" onClick={onClose}>
            <img src="public/IconClose.png" alt="Закрыть" />
          </button>
        </header>
        <div className="popup__form">
          <div className="popup__field">
            <label className="popup__label">Название фильма</label>
            <input
              className="popup__input"
              type="text"
              placeholder="Например, «Гражданин Кейн»"
              value={filmName}
              onChange={(e) => setFilmName(e.target.value)}
            />
          </div>
          <div className="popup__field">
            <label className="popup__label">Продолжительность фильма (мин.)</label>
            <input
              className="popup__input"
              type="number"
              value={filmDuration}
              onChange={(e) => setFilmDuration(e.target.value)}
            />
          </div>
          <div className="popup__field">
            <label className="popup__label">Описание фильма</label>
            <textarea
              className="popup__input popup__textarea"
              value={filmDescription}
              onChange={(e) => setFilmDescription(e.target.value)}
              style={{ height: 80, resize: 'none' }}
            />
          </div>
          <div className="popup__field">
            <label className="popup__label">Страна</label>
            <input
              className="popup__input"
              type="text"
              value={filmOrigin}
              onChange={(e) => setFilmOrigin(e.target.value)}
            />
          </div>
          <div className="popup__buttons">
            <button className="popup__button popup__button--primary" onClick={handleAddFilm}>
              Добавить фильм
            </button>
            <button className="popup__button popup__button--primary" onClick={handlePosterClick}>
              Загрузить постер
            </button>
            <input
              type="file"
              accept="image/png"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className="popup__button popup__button--secondary" onClick={onClose}>
              Отменить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFilmPopup;