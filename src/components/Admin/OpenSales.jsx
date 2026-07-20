import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

function OpenSales() {
  const { halls, toggleHallOpen } = useData();
  const [selectedHallId, setSelectedHallId] = useState(null);

  const selectedHall = halls.find(h => h.id == selectedHallId);

  const handleToggle = async () => {
    if (!selectedHall) return;
    await toggleHallOpen(selectedHall.id, !selectedHall.hall_open);
  };

  return (
    <section className="conf-step">
      <header className="conf-step__header">
        <h2 className="conf-step__title">Открыть продажи</h2>
      </header>
      <div className="conf-step__wrapper" style={{ alignItems: 'center' }}>
        <p className="conf-step__paragraph" style={{ width: '100%', marginBottom: 15 }}>
          Выберите залл для открытия/закрытия продаж:
        </p>
        <div className="conf-step__selectors">
          {halls.map((hall) => (
            <span
              key={hall.id}
              className={`conf-step__selector ${hall.id == selectedHallId ? 'conf-step__selector--active' : ''}`}
              onClick={() => setSelectedHallId(hall.id)}
            >
              {hall.hall_name}
            </span>
          ))}
        </div>

        {selectedHall && (
          <>
            <p className="conf-step__paragraph" style={{ textAlign: 'center', marginTop: 25 }}>
              {selectedHall.hall_open
                ? 'Продажи открыты. Вы можете приостановить их.'
                : 'Продажи приостановлены. Вы можете открыть их снова.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
              <button className="conf-step__button" onClick={handleToggle}>
                {selectedHall.hall_open ? 'Приостановить продажу' : 'Открыть продажу'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default OpenSales;