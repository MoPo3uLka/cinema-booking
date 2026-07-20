import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

function PriceConfigurator() {
  const { halls, updateHallPrices } = useData();
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [standartPrice, setStandartPrice] = useState(0);
  const [vipPrice, setVipPrice] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const selectedHall = halls.find(h => h.id == selectedHallId);

  // При выборе зала подставляем его текущие цены
  useEffect(() => {
    if (selectedHall) {
      setStandartPrice(selectedHall.hall_price_standart);
      setVipPrice(selectedHall.hall_price_vip);
    } else {
      setStandartPrice(0);
      setVipPrice(0);
    }
  }, [selectedHall]);

  const handleSave = async () => {
    if (!selectedHallId) return;
    setIsSaving(true);
    try {
      await updateHallPrices(selectedHallId, standartPrice, vipPrice);
    } catch (e) {
      alert('Ошибка сохранения цен: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (selectedHall) {
      setStandartPrice(selectedHall.hall_price_standart);
      setVipPrice(selectedHall.hall_price_vip);
    }
  };

  return (
    <section className="conf-step">
      <header className="conf-step__header">
        <h2 className="conf-step__title">Конфигурация цен</h2>
      </header>
      <div className="conf-step__wrapper">
        <div className="configure">
          <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
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
        </div>

        {selectedHall && (
          <>
            <p className="conf-step__paragraph" style={{ marginTop: 30 }}>
              Установите цены для типов кресел:
            </p>

            <div className="price-config">
              <div className="price-config__row">
                <div className="conf-step__field">
                  <label className="conf-step__label">Цена, рублей</label>
                  <input
                    className="conf-step__input"
                    type="number"
                    min="0"
                    value={standartPrice}
                    onChange={(e) => setStandartPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
                <span className="price-config__text">за</span>
                <span className="conf-step__chair conf-step__chair--standart" />
                <span className="price-config__text">обычные кресла</span>
              </div>

              <div className="price-config__row">
                <div className="conf-step__field">
                  <label className="conf-step__label">Цена, рублей</label>
                  <input
                    className="conf-step__input"
                    type="number"
                    min="0"
                    value={vipPrice}
                    onChange={(e) => setVipPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
                <span className="price-config__text">за</span>
                <span className="conf-step__chair conf-step__chair--vip" />
                <span className="price-config__text">VIP кресла</span>
              </div>
            </div>

            <div className="conf-step__buttons">
              <button className="conf-step__button-cancel" onClick={handleCancel}>
                Отмена
              </button>
              <button className="conf-step__button-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default PriceConfigurator;