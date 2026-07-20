import { QRCodeSVG } from 'qrcode.react';

function Payment({
  filmName,
  seats,
  hallNumber,
  seanceTime,
  totalCost,
  onPurchase,
  purchasedTickets,
  hallName,
}) {
  if (purchasedTickets && purchasedTickets.length > 0) {
    const seatsInfo = purchasedTickets
      .map(t => `Ряд ${t.ticket_row} Место ${t.ticket_place}`)
      .join(', ');

    const qrData = JSON.stringify({
      date: purchasedTickets[0].ticket_date,
      time: purchasedTickets[0].ticket_time,
      film: filmName,
      hall: hallName,
      seats: seatsInfo,
      note: 'Билет действителен строго на свой сеанс',
    });

    return (
      <div className="payment">
        <div className="payment__header">
          <h2 className="payment__title">Электронные билеты</h2>
        </div>
        <div className="payment__info-wrapper">
          <div className="payment__info">
            <div className="payment__detail">
              На фильм: <strong>{filmName}</strong>
            </div>
            <div className="payment__detail">
              Места: <strong>{seats}</strong>
            </div>
            <div className="payment__detail">
              В зале: <strong>{hallNumber}</strong>
            </div>
            <div className="payment__detail">
              Начало сеанса: <strong>{seanceTime}</strong>
            </div>
          </div>

          {/* QR-код вместо кнопки */}
          <div className="payment__qr-container">
            <QRCodeSVG value={qrData} size={200} />
          </div>

          <div className="payment__hint">
            <p className="payment__hint-text">
              Покажите QR-код нашему контроллеру для подтверждения бронирования.
            </p>
            <p className="payment__hint-text">Приятного просмотра!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment">
      <div className="payment__header">
        <h2 className="payment__title">Вы выбрали билеты:</h2>
      </div>
      <div className="payment__info-wrapper">
        <div className="payment__info">
          <div className="payment__detail">
            На фильм: <strong>{filmName}</strong>
          </div>
          <div className="payment__detail">
            Места: <strong>{seats}</strong>
          </div>
          <div className="payment__detail">
            В зале: <strong>{hallNumber}</strong>
          </div>
          <div className="payment__detail">
            Начало сеанса: <strong>{seanceTime}</strong>
          </div>
          <div className="payment__detail">
            Стоимость: <strong>{totalCost}</strong> рублей
          </div>
        </div>
        <button className="payment__button" onClick={onPurchase}>
          Получить код бронирования
        </button>
        <div className="payment__hint">
          <p className="payment__hint-text">
            После оплаты билет будет доступен в этом окне, а также придёт вам на почту.
            Покажите QR-код нашему контроллёру у входа в зал.
          </p>
          <p className="payment__hint-text">Приятного просмотра!</p>
        </div>
      </div>
    </div>
  );
}

export default Payment;