import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import AddFilmPopup from './AddFilmPopup';
import AddSeancePopup from './AddSeancePopup';

function SessionsGrid() {
  const { films, halls, seances, deleteFilm, deleteSeance } = useData();
  const [showFilmPopup, setShowFilmPopup] = useState(false);
  const [showSeancePopup, setShowSeancePopup] = useState(false);
  const [selectedHallForSeance, setSelectedHallForSeance] = useState(null);
  const [selectedFilmForSeance, setSelectedFilmForSeance] = useState(null);

  const seancesByHall = halls.map(hall => ({
    ...hall,
    seances: seances.filter(s => s.seance_hallid === hall.id),
  }));

  const handleDeleteFilm = (filmId) => {
    if (window.confirm('Удалить фильм?')) {
      deleteFilm(filmId);
    }
  };

  const handleFilmDragStart = (e, film) => {
    e.dataTransfer.setData('filmId', film.id);
    e.dataTransfer.effectAllowed = 'move';

    const img = new Image();
    img.src = film.film_poster;
    img.style.width = '38px';
    img.style.height = '50px';
    img.style.objectFit = 'cover';
    document.body.appendChild(img);
    e.dataTransfer.setDragImage(img, 19, 25);
    setTimeout(() => document.body.removeChild(img), 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnHall = (e, hallId) => {
    e.preventDefault();
    const filmId = e.dataTransfer.getData('filmId');
    if (!filmId) return;
    setSelectedHallForSeance(hallId);
    setSelectedFilmForSeance(filmId);
    setShowSeancePopup(true);
  };

  const handleSeanceDragStart = (e, seanceId) => {
    e.dataTransfer.setData('seanceId', seanceId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSeanceDragEnd = (e) => {
    if (e.dataTransfer.dropEffect === 'none') {
      const seanceId = e.dataTransfer.getData('seanceId');
      if (seanceId) deleteSeance(seanceId);
    }
  };

  return (
    <section className="conf-step">
      <header className="conf-step__header">
        <h2 className="conf-step__title">Сетка сеансов</h2>
      </header>
      <div className="conf-step__wrapper">
        <div className="conf-step__paragraph">
          <button className="conf-step__button" onClick={() => setShowFilmPopup(true)}>
            Добавить фильм
          </button>
        </div>

        <div className="conf-step__movies-grid">
          {films.map(film => (
            <div
              key={film.id}
              className="conf-step__movie-card"
              draggable
              onDragStart={(e) => handleFilmDragStart(e, film)}
            >
              <img src={film.film_poster} alt={film.film_name} className="conf-step__movie-poster" />
              <div className="conf-step__movie-info">
                <h4 className="conf-step__movie-name">{film.film_name}</h4>
                <p className="conf-step__movie-duration">{film.film_duration} минут</p>
              </div>
              <button
                className="conf-step__movie-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFilm(film.id);
                }}
              />
            </div>
          ))}
        </div>

        <div className="conf-step__seances">
          {seancesByHall.map(hall => (
            <div key={hall.id} className="conf-step__seances-hall">
              <h3 className="conf-step__seances-hall-title">{hall.hall_name}</h3>
              <div
                className="conf-step__seances-timeline"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnHall(e, hall.id)}
              >
                {hall.seances.map(seance => {
                  const film = films.find(f => f.id === seance.seance_filmid);
                  if (!film) return null;

                  // Время начала в минутах от полуночи
                  const [startH, startM] = seance.seance_time.split(':').map(Number);
                  const startMinutes = startH * 60 + startM;
                  const duration = film.film_duration;
                  const endMinutes = startMinutes + duration;

                  // Шкала 24 часа (0–24), но видимая область 0–100%
                  const totalMinutes = 24 * 60;
                  let leftPercent = (startMinutes / totalMinutes) * 100;
                  let widthPercent = (duration / totalMinutes) * 100;

                  // Ограничиваем выход за правый край (100%)
                  if (leftPercent + widthPercent > 100) {
                    widthPercent = 100 - leftPercent;
                  }
                  // Ограничиваем выход за левый край
                  if (leftPercent < 0) {
                    widthPercent += leftPercent;
                    leftPercent = 0;
                  }
                  // Минимальная ширина, чтобы было видно хотя бы начало
                  if (widthPercent < 0.5) widthPercent = 0.5;

                  return (
                    <div
                      key={seance.id}
                      className="conf-step__seances-movie"
                      draggable
                      onDragStart={(e) => handleSeanceDragStart(e, seance.id)}
                      onDragEnd={handleSeanceDragEnd}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <div className="conf-step__seances-movie-title">{film.film_name}</div>
                      <div className="conf-step__seances-movie-start">{seance.seance_time}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="conf-step__buttons">
          <button className="conf-step__button-cancel">Отмена</button>
          <button className="conf-step__button-save">Сохранить</button>
        </div>
      </div>

      {showFilmPopup && <AddFilmPopup onClose={() => setShowFilmPopup(false)} />}
      {showSeancePopup && (
        <AddSeancePopup
          onClose={() => setShowSeancePopup(false)}
          preSelectedHallId={selectedHallForSeance}
          preSelectedFilmId={selectedFilmForSeance}
        />
      )}
    </section>
  );
}

export default SessionsGrid;