import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import AddFilmPopup from './AddFilmPopup';
import AddSeancePopup from './AddSeancePopup';

function SessionsGrid() {
  const { films, halls, seances: serverSeances, addSeance, deleteSeance, deleteFilm } = useData();

  const [localSeances, setLocalSeances] = useState([]);
  const [originalSeances, setOriginalSeances] = useState([]);
  const [showFilmPopup, setShowFilmPopup] = useState(false);
  const [showSeancePopup, setShowSeancePopup] = useState(false);
  const [selectedHallForSeance, setSelectedHallForSeance] = useState(null);
  const [selectedFilmForSeance, setSelectedFilmForSeance] = useState(null);
  const [draggedSeanceHallId, setDraggedSeanceHallId] = useState(null);

  useEffect(() => {
    setLocalSeances([...serverSeances]);
    setOriginalSeances([...serverSeances]);
  }, [serverSeances]);

  const seancesByHall = halls.map(hall => ({
    ...hall,
    // Нестрогое равенство: вдруг hall.id строка, а seance_hallid число (или наоборот)
    seances: localSeances.filter(s => s.seance_hallid == hall.id),
  }));

  const handleAddSeanceLocal = (hallId, filmId, time) => {
    const newSeance = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      seance_hallid: Number(hallId),    // гарантируем число
      seance_filmid: Number(filmId),    // гарантируем число
      seance_time: time,
    };
    setLocalSeances(prev => [...prev, newSeance]);
  };

  const handleDeleteSeanceLocal = (seanceId) => {
    setLocalSeances(prev => prev.filter(s => s.id != seanceId));
  };

  const handleSave = async () => {
    const toDelete = originalSeances.filter(
      os => !localSeances.some(ls => ls.id === os.id)
    );
    const toAdd = localSeances.filter(ls => typeof ls.id === 'string' && ls.id.startsWith('temp-'));

    try {
      for (const seance of toDelete) {
        await deleteSeance(seance.id);
      }
      for (const seance of toAdd) {
        await addSeance(seance.seance_hallid, seance.seance_filmid, seance.seance_time);
      }
    } catch (e) {
      alert('Ошибка сохранения: ' + e.message);
    }
  };

  const handleCancel = () => {
    setLocalSeances([...originalSeances]);
  };

  const handleFilmDragStart = (e, film) => {
    e.dataTransfer.setData('filmId', film.id);
    e.dataTransfer.effectAllowed = 'move';
    const poster = e.currentTarget.querySelector('.conf-step__movie-poster');
    if (poster) {
      e.dataTransfer.setDragImage(poster, 19, 25);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnHall = (e, hallId) => {
    e.preventDefault();
    const filmId = e.dataTransfer.getData('filmId');
    if (filmId) {
    setSelectedHallForSeance(hallId);
    setSelectedFilmForSeance(filmId);
    setShowSeancePopup(true);
    }
  };

  const handleSeanceDragStart = (e, seanceId, hallId) => {
    e.dataTransfer.setData('seanceId', seanceId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedSeanceHallId(hallId);

    const seance = localSeances.find(s => s.id === seanceId);
    if (seance) {
      const film = films.find(f => f.id == seance.seance_filmid);
      if (film) {
        const img = new Image();
        img.src = film.film_poster;
        img.style.width = '38px';
        img.style.height = '50px';
        img.style.objectFit = 'cover';
        document.body.appendChild(img);
        e.dataTransfer.setDragImage(img, 19, 25);
        setTimeout(() => {
          if (img.parentNode) document.body.removeChild(img);
        }, 0);
      }
    }
  };

  const handleSeanceDragEnd = () => {
    setDraggedSeanceHallId(null);
  };

  const handleDeleteFilm = (filmId) => {
    if (window.confirm('Удалить фильм?')) {
      deleteFilm(filmId);
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
              <div className="conf-step__seances-row">
                {draggedSeanceHallId === hall.id && (
                  <div
                    className="trash-zone"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const seanceId = e.dataTransfer.getData('seanceId');
                      if (seanceId) {
                        handleDeleteSeanceLocal(seanceId);
                      }
                      setDraggedSeanceHallId(null);
                    }}
                  >
                    🗑️
                  </div>
                )}
                <div
                  className="conf-step__seances-timeline"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnHall(e, hall.id)}
                >
                  {hall.seances.map(seance => {
                    // Нестрогое сравнение, чтобы точно найти фильм
                    const film = films.find(f => f.id == seance.seance_filmid);
                    if (!film) return null;

                    const [startH, startM] = seance.seance_time.split(':').map(Number);
                    const startMinutes = startH * 60 + startM;
                    const duration = film.film_duration;
                    const endMinutes = startMinutes + duration;
                    const totalMinutes = 24 * 60;
                    let leftPercent = (startMinutes / totalMinutes) * 100;
                    let widthPercent = (duration / totalMinutes) * 100;

                    if (leftPercent + widthPercent > 100) widthPercent = 100 - leftPercent;
                    if (leftPercent < 0) {
                      widthPercent += leftPercent;
                      leftPercent = 0;
                    }
                    if (widthPercent < 0.5) widthPercent = 0.5;

                    return (
                      <div
                        key={seance.id}
                        className="conf-step__seances-movie"
                        draggable
                        onDragStart={(e) => handleSeanceDragStart(e, seance.id, hall.id)}
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
            </div>
          ))}
        </div>

        <div className="conf-step__buttons">
          <button className="conf-step__button-cancel" onClick={handleCancel}>Отмена</button>
          <button className="conf-step__button-save" onClick={handleSave}>Сохранить</button>
        </div>
      </div>

      {showFilmPopup && <AddFilmPopup onClose={() => setShowFilmPopup(false)} />}
      {showSeancePopup && (
        <AddSeancePopup
          onClose={() => setShowSeancePopup(false)}
          preSelectedHallId={selectedHallForSeance}
          preSelectedFilmId={selectedFilmForSeance}
          onAddSeance={handleAddSeanceLocal}
        />
      )}
    </section>
  );
}

export default SessionsGrid;