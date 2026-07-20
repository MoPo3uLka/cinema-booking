import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import Breadcrumbs from '../common/Breadcrumbs';
import Payment from './Payment';

function HallScheme() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const date = searchParams.get('date');
  const { films, halls, seances, hallConfig, purchaseTicket } = useData();

  const [config, setConfig] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStep, setBookingStep] = useState('select'); // 'select' | 'payment'
  const [purchasedTickets, setPurchasedTickets] = useState(null); // массив билетов после покупки
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const film = films.find(f => f.id == movieId);
  const session = seances.find(s => s.id == sessionId);
  const hall = halls.find(h => h.id == (session?.seance_hallid));
  const hallNumber = hall?.hall_name.match(/\d+/)?.[0] || hall?.hall_name;

  useEffect(() => {
    if (sessionId && date) {
      setLoading(true);
      setError(null);
      hallConfig(sessionId, date)
        .then(setConfig)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [sessionId, date, hallConfig]);

  const toggleSeat = (row, col) => {
    if (bookingStep !== 'select') return;
    const status = config[row]?.[col];
    if (status === 'taken' || status === 'disabled') return;
    const key = `${row}-${col}`;
    setSelectedSeats(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const getChairClass = (row, col) => {
    const status = config[row]?.[col];
    const key = `${row}-${col}`;
    if (status === 'taken' || status === 'disabled') return 'buying-scheme__chair--taken';
    if (selectedSeats.includes(key)) return 'buying-scheme__chair--selected';
    if (status === 'vip') return 'buying-scheme__chair--vip';
    return 'buying-scheme__chair--standart';
  };

  const totalCost = selectedSeats.reduce((sum, key) => {
    const [r, c] = key.split('-').map(Number);
    const type = config[r]?.[c];
    const price = type === 'vip' ? hall.hall_price_vip : hall.hall_price_standart;
    return sum + price;
  }, 0);

  const handlePurchase = async () => {
    if (selectedSeats.length === 0) return;
    const tickets = selectedSeats.map(key => {
      const [row, place] = key.split('-').map(Number);
      const type = config[row]?.[place];
      const coast = type === 'vip' ? hall.hall_price_vip : hall.hall_price_standart;
      return { row: row + 1, place: place + 1, coast };
    });
    try {
      const result = await purchaseTicket(sessionId, date, tickets);
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error('Не удалось получить билеты');
      }
      setPurchasedTickets(result);
      // bookingStep остаётся 'payment', но Payment увидит purchasedTickets
    } catch (e) {
      alert('Ошибка при покупке билета: ' + e.message);
    }
  };

  const selectedSeatsFormatted = selectedSeats
    .map(key => {
      const [, place] = key.split('-');
      return place;
    })
    .join(', ');

  if (!sessionId || !date) {
    return <p className="text-center mt-5">Сеанс не выбран.</p>;
  }

  if (bookingStep === 'payment') {
    return (
      <div className="hall-page">
        <Payment
          filmName={film?.film_name}
          seats={selectedSeatsFormatted}
          seanceTime={session?.seance_time}
          totalCost={totalCost}
          onPurchase={handlePurchase}
          purchasedTickets={purchasedTickets}
          hallName={hall?.hall_name}
          hallNumber={hallNumber}
        />
      </div>
    );
  }

  // Экран выбора мест (select)
  return (
    <div className="hall-page">
      <section className="buying">
        <div className="buying__info">
          <div className="buying__info-description">
            <h2 className="buying__film-title">{film?.film_name}</h2>
            <p className="buying__start-time">Начало сеанса: {session?.seance_time}</p>
            <div className="buying__info-hall">
              <h3 className="buying__hall-name">{hall?.hall_name}</h3>
            </div>
          </div>
        </div>
        <div className="buying-scheme">
          {loading && <p className="buying-scheme__loading">Загрузка схемы зала...</p>}
          {error && <p className="buying-scheme__error">Ошибка: {error}</p>}
          {!loading && !error && config.length > 0 && (
            <div className="buying-scheme__wrapper">
              <div className="buying-scheme__screen-wrapper">
                <img src="/Screen.png" alt="Экран" className="buying-scheme__screen" />
              </div>
              {config.map((row, rowIdx) => (
                <div key={rowIdx} className="buying-scheme__row">
                  {row.map((seat, colIdx) => (
                    <span
                      key={colIdx}
                      className={`buying-scheme__chair ${getChairClass(rowIdx, colIdx)}`}
                      onClick={() => toggleSeat(rowIdx, colIdx)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
          <div className="buying-scheme__legend">
            <div className="buying-scheme__legend-col">
              <div className="buying-scheme__legend-item">
                <span className="buying-scheme__chair buying-scheme__chair--standart legend-chair" />
                <span>Свободно ({hall?.hall_price_standart} руб)</span>
              </div>
              <div className="buying-scheme__legend-item">
                <span className="buying-scheme__chair buying-scheme__chair--vip legend-chair" />
                <span>Свободно VIP ({hall?.hall_price_vip} руб)</span>
              </div>
            </div>
            <div className="buying-scheme__legend-col">
              <div className="buying-scheme__legend-item">
                <span className="buying-scheme__chair buying-scheme__chair--taken legend-chair" />
                <span>Занято</span>
              </div>
              <div className="buying-scheme__legend-item">
                <span className="buying-scheme__chair buying-scheme__chair--selected legend-chair" />
                <span>Выбрано</span>
              </div>
            </div>
          </div>
          <button
            className="buying__book-btn"
            disabled={selectedSeats.length === 0}
            onClick={() => setBookingStep('payment')}
          >
            Забронировать
          </button>
        </div>
      </section>
    </div>
  );
}

export default HallScheme;