import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState({ halls: [], films: [], seances: [] });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const all = await api.fetchAllData();
      setData({
        halls: all.halls || [],
        films: all.films || [],
        seances: all.seances || [],
      });
    } catch (e) {
      console.error('Ошибка загрузки данных:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const hallConfig = async (seanceId, date) => api.getHallConfig(seanceId, date);
  const purchaseTicket = async (seanceId, ticketDate, tickets) =>
    api.buyTicket(seanceId, ticketDate, tickets);

  const doLogin = async (login, password) => {
    await api.login(login, password);
    setIsLoggedIn(true);
  };

  const addHall = async (hallName) => {
    await api.addHall(hallName);
    await refreshData();
  };

  const deleteHall = async (hallId) => {
    await api.deleteHall(hallId);
    await refreshData();
  };

  const updateHallConfig = async (hallId, rowCount, placeCount, config) => {
    await api.updateHallConfig(hallId, rowCount, placeCount, config);
    await refreshData();
  };

  const updateHallPrices = async (hallId, priceStandart, priceVip) => {
    await api.updateHallPrices(hallId, priceStandart, priceVip);
    await refreshData();
  };

  const toggleHallOpen = async (hallId, open) => {
    await api.toggleHallOpen(hallId, open ? 1 : 0);
    await refreshData();
  };

  const addFilm = async (name, duration, description, origin, posterFile) => {
    await api.addFilm(name, duration, description, origin, posterFile);
    await refreshData();
  };

  const deleteFilm = async (filmId) => {
    await api.deleteFilm(filmId);
    await refreshData();
  };

  const addSeance = async (hallId, filmId, time) => {
    await api.addSeance(hallId, filmId, time);
    await refreshData();
  };

  const deleteSeance = async (seanceId) => {
    await api.deleteSeance(seanceId);
    await refreshData();
  };

  return (
    <DataContext.Provider value={{
      ...data,
      loading,
      isLoggedIn,
      refreshData,
      hallConfig,
      purchaseTicket,
      login: doLogin,
      addHall,
      deleteHall,
      updateHallConfig,
      updateHallPrices,
      toggleHallOpen,
      addFilm,
      deleteFilm,
      addSeance,
      deleteSeance,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);