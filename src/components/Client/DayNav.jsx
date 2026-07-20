function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function DayNav({ selectedDate, onDateChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const isToday = (date) => date.toDateString() === today.toDateString();
  const isWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;
  const isSelected = (date) => selectedDate === formatLocalDate(date);

  const handleDayClick = (date) => {
    onDateChange(formatLocalDate(date));
  };

  const formatDay = (date) => {
    const day = date.getDate();
    const weekDayShort = date.toLocaleDateString('ru-RU', { weekday: 'short' });
    const weekDayFormatted = weekDayShort.charAt(0).toUpperCase() + weekDayShort.slice(1).replace('.', ',');
    return { day, weekDay: weekDayFormatted };
  };

  return (
    <nav className="day-nav">
      {days.map((date, index) => {
        const { day, weekDay } = formatDay(date);
        const active = isSelected(date);
        const weekend = isWeekend(date);
        const todayLabel = isToday(date) ? 'Сегодня' : '';

        return (
          <div
            key={index}
            className={`day-nav__item ${active ? 'day-nav__item--active' : ''} ${weekend ? 'day-nav__item--weekend' : ''}`}
          >
            <button
              className="day-nav__link"
              onClick={() => handleDayClick(date)}
              aria-pressed={active}
            >
              {todayLabel && <span className="day-nav__label">{todayLabel}</span>}
              <span className="day-nav__day-week">{weekDay}</span>
              <span className="day-nav__day-number">{day}</span>
            </button>
          </div>
        );
      })}
      <div className="day-nav__item day-nav__item--next">
        <button className="day-nav__link">
          <span className="day-nav__arrow">&gt;</span>
        </button>
      </div>
    </nav>
  );
}

export default DayNav;