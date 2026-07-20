import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import AddHallPopup from './AddHallPopup';
import HallConfigurator from './HallConfigurator';
import PriceConfigurator from './PriceConfigurator';
import SessionsGrid from './SessionsGrid';
import OpenSales from './OpenSales';

function HallEditor() {
  const { halls, addHall, deleteHall } = useData();
  const [showPopup, setShowPopup] = useState(false);

  const handleAddHall = (name) => {
    addHall(name);
  };

  return (
    <>
      <section className="conf-step">
        <header className="conf-step__header">
          <h2 className="conf-step__title">Управление залами</h2>
        </header>
        <div className="conf-step__wrapper">
          <p className="conf-step__label">Доступные залы:</p>
          <ul className="conf-step__list">
            {halls.map((hall) => (
              <li key={hall.id} className="conf-step__item">
                <span className="conf-step__item-dash">–</span>
                <span className="conf-step__item-name">{hall.hall_name}</span>
                <button
                  className="conf-step__item-delete"
                  onClick={() => deleteHall(hall.id)}
                  title="Удалить зал"
                />
              </li>
            ))}
          </ul>
          <button className="conf-step__button" onClick={() => setShowPopup(true)}>
            Добавить зал
          </button>
        </div>
        {showPopup && (
          <AddHallPopup
            onClose={() => setShowPopup(false)}
            onAdd={handleAddHall}
          />
        )}
      </section>

      <HallConfigurator />
      <PriceConfigurator />
      <SessionsGrid />
      <OpenSales />
    </>
  );
}

export default HallEditor;