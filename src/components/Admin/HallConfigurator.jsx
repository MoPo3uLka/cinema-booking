import { useState, useEffect, useCallback } from 'react';
import { useData } from '../../contexts/DataContext';

function HallConfigurator() {
  const { halls, updateHallConfig } = useData();
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [rows, setRows] = useState(5);
  const [places, setPlaces] = useState(8);
  const [config, setConfig] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Генерация дефолтной схемы, если конфигурация зала пуста
  const generateDefaultConfig = useCallback((hall) => {
    const defRows = hall.hall_rows || 5;
    const defPlaces = hall.hall_places || 8;
    const newConfig = [];
    for (let r = 0; r < defRows; r++) {
      const row = [];
      for (let c = 0; c < defPlaces; c++) {
        row.push('standart');
      }
      newConfig.push(row);
    }
    return newConfig;
  }, []);

  // Единственный эффект: при выборе зала или обновлении списка залов (после сохранения)
  useEffect(() => {
    if (!selectedHallId) {
      setRows(5);
      setPlaces(8);
      setConfig([]);
      return;
    }
    const hall = halls.find(h => h.id == selectedHallId);
    if (!hall) return;

    setRows(hall.hall_rows);
    setPlaces(hall.hall_places);

    const hallConfig = hall.hall_config && hall.hall_config.length
      ? hall.hall_config.map(row => [...row])
      : generateDefaultConfig(hall);
    setConfig(hallConfig);
  }, [selectedHallId, halls, generateDefaultConfig]);

  // Обработчики изменения размеров – сразу пересчитывают config без дополнительного эффекта
  const handleRowsChange = (newRows) => {
    const clamped = Math.max(1, parseInt(newRows) || 1);
    setRows(clamped);
    setConfig(prev => {
      const newConfig = [...prev];
      if (clamped > newConfig.length) {
        while (newConfig.length < clamped) {
          newConfig.push(Array(places).fill('standart'));
        }
      } else {
        newConfig.length = clamped;
      }
      return newConfig;
    });
  };

  const handlePlacesChange = (newPlaces) => {
    const clamped = Math.max(1, parseInt(newPlaces) || 1);
    setPlaces(clamped);
    setConfig(prev => prev.map(row => {
      if (clamped > row.length) {
        return [...row, ...Array(clamped - row.length).fill('standart')];
      } else {
        return row.slice(0, clamped);
      }
    }));
  };

  const handleChairClick = (rIdx, cIdx) => {
    setConfig(prev => {
      const newConfig = prev.map(row => [...row]);
      const current = newConfig[rIdx][cIdx];
      newConfig[rIdx][cIdx] =
        current === 'standart' ? 'vip' : current === 'vip' ? 'disabled' : 'standart';
      return newConfig;
    });
  };

  const handleSave = async () => {
    if (!selectedHallId) return;
    setIsSaving(true);
    try {
      await updateHallConfig(selectedHallId, rows, places, config);
      // После успешного сохранения halls обновится в контексте, и useEffect перезагрузит config
    } catch (e) {
      alert('Ошибка сохранения: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!selectedHallId) return;
    const hall = halls.find(h => h.id == selectedHallId);
    if (hall) {
      setRows(hall.hall_rows);
      setPlaces(hall.hall_places);
      const hallConfig = hall.hall_config && hall.hall_config.length
        ? hall.hall_config.map(row => [...row])
        : generateDefaultConfig(hall);
      setConfig(hallConfig);
    }
  };

  const getChairClass = (type) => {
    if (type === 'vip') return 'conf-step__chair--vip';
    if (type === 'disabled' || type === 'taken') return 'conf-step__chair--disabled';
    return 'conf-step__chair--standart';
  };

  return (
    <section className="conf-step">
      <header className="conf-step__header">
        <h2 className="conf-step__title">Конфигурация залов</h2>
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

        {selectedHallId && (
          <>
            <div className="places">
              <p className="conf-step__paragraph">
                Укажите количество рядов и максимальное количество кресел в ряду:
              </p>
              <div className="conf-step__legend">
                <div className="conf-step__field">
                  <label className="conf-step__label">Рядов, шт</label>
                  <input
                    className="conf-step__input"
                    type="number"
                    value={rows}
                    min="1"
                    max="15"
                    onChange={(e) => handleRowsChange(e.target.value)}
                  />
                </div>
                <span className="conf-step__multiply">×</span>
                <div className="conf-step__field">
                  <label className="conf-step__label">Мест, шт</label>
                  <input
                    className="conf-step__input"
                    type="number"
                    value={places}
                    min="1"
                    max="15"
                    onChange={(e) => handlePlacesChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="frame-10">
              <p className="conf-step__paragraph">
                Теперь вы можете указать типы кресел на схеме зала:
              </p>
              <div className="conf-step__legend-hint">
                <div className="conf-step__chair-legend">
                  <span className="conf-step__chair conf-step__chair--standart"></span>
                  <span>— обычные кресла</span>
                </div>
                <div className="conf-step__chair-legend">
                  <span className="conf-step__chair conf-step__chair--vip"></span>
                  <span>— VIP кресла</span>
                </div>
                <div className="conf-step__chair-legend">
                  <span className="conf-step__chair conf-step__chair--disabled"></span>
                  <span>— заблокированные (нет кресла)</span>
                </div>
              </div>
              <p className="conf-step__hint">
                Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
              </p>

              <div className="conf-step__hall">
                <div className="conf-step__screen">экран</div>
                <div className="conf-step__hall-wrapper">
                  {config.map((row, rIdx) => (
                    <div key={rIdx} className="conf-step__row">
                      {row.map((type, cIdx) => (
                        <span
                          key={cIdx}
                          className={`conf-step__chair ${getChairClass(type)}`}
                          onClick={() => handleChairClick(rIdx, cIdx)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
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

export default HallConfigurator;