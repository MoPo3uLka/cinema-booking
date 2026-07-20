import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Link } from 'react-router-dom';
import DayNav from './DayNav';

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Index() {
  const { films, halls, seances } = useData();
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));

  const filmsWithSessions = films.filter(film =>
    seances.some(s => s.seance_filmid === film.id)
  );

  const getSessionsByHall = (filmId) => {
    const filmSeances = seances.filter(s => s.seance_filmid === filmId);
    const grouped = {};
    filmSeances.forEach(s => {
      if (!grouped[s.seance_hallid]) {
        grouped[s.seance_hallid] = [];
      }
      grouped[s.seance_hallid].push(s);
    });
    return grouped;
  };

  const isTimePast = (time, date) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const [year, month, day] = date.split('-').map(Number);
    const sessionDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return sessionDate.getTime() < now.getTime();
  };

  return (
    <div className="client-page">
      <DayNav selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <main className="main-content">
        {filmsWithSessions.length > 0 ? (
          filmsWithSessions.map(film => {
            const hallsWithSessions = getSessionsByHall(film.id);
            return (
              <section key={film.id} className="movie-section-block">
                <div className="movie__info">
                  <div className="movie__poster">
                    <img src={film.film_poster} alt={film.film_name} className="poster-img" />
                  </div>
                  <div className="movie__description">
                    <h2 className="movie__title">{film.film_name}</h2>
                    <p className="movie__synopsis">{film.film_description || ''}</p>
                    <div className="movie__data">
                      <span className="movie__duration">{film.film_duration} минут</span>
                      <span className="movie__country">{film.film_origin}</span>
                    </div>
                  </div>
                </div>

                {Object.entries(hallsWithSessions).map(([hallId, sessions]) => {
                  const hall = halls.find(h => h.id == hallId);
                  if (!hall) return null;
                  return (
                    <div key={hallId} className="movie-seances__hall">
                      <h3 className="movie-seances__hall-title">{hall.hall_name}</h3>
                      <ul className="movie-seances__list">
                        {sessions.map(session => {
                          const past = isTimePast(session.seance_time, selectedDate);
                          return (
                            <li key={session.id} className="movie-seances__item">
                              <Link
                                to={`/hall/${film.id}?sessionId=${session.id}&date=${selectedDate}`}
                                className={`movie-seances__time-btn ${past ? 'disabled' : ''}`}
                                onClick={(e) => past && e.preventDefault()}
                                style={past ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                              >
                                {session.seance_time}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </section>
            );
          })
        ) : (
          <p className="no-sessions">Нет сеансов на выбранную дату.</p>
        )}
      </main>
    </div>
  );
}

export default Index;