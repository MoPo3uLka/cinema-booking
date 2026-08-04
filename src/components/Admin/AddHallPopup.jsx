import { useState } from 'react';

function AddHallPopup({ onClose, onAdd }) {
  const [hallName, setHallName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hallName.trim()) return;
    onAdd(hallName);
    setHallName('');
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <header className="popup__header">
          <h2 className="popup__title">Добавление Зала</h2>
          <button className="popup__close" onClick={onClose}>
            <img src="/IconClose.png" alt="Закрыть" />
          </button>
        </header>
        <form className="popup__form" onSubmit={handleSubmit}>
          <div className="popup__field">
            <label className="popup__label">Название зала</label>
            <input
              className="popup__input"
              type="text"
              placeholder="Например, «Зал 1»"
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              required
            />
          </div>
          <div className="popup__buttons">
            <button type="submit" className="popup__button popup__button--primary">Добавить зал</button>
            <button type="button" className="popup__button popup__button--secondary" onClick={onClose}>Отменить</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddHallPopup;