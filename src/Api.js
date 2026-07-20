const BASE_URL = import.meta.env.PROD
  ? 'https://shfe-diplom.neto-server.ru'
  : '/api';

async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    credentials: 'include',
    mode: 'cors',
    ...options,
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Ошибка запроса');
  }
  return data.result;
}

export async function fetchAllData() {
  return request('/alldata');
}

export async function getHallConfig(seanceId, date) {
  return request(`/hallconfig?seanceId=${seanceId}&date=${date}`);
}

export async function buyTicket(seanceId, ticketDate, tickets) {
  const formData = new FormData();
  formData.set('seanceId', seanceId);
  formData.set('ticketDate', ticketDate);
  formData.set('tickets', JSON.stringify(tickets));
  return request('/ticket', { method: 'POST', body: formData });
}

export async function login(loginStr, password) {
  const formData = new FormData();
  formData.set('login', loginStr);
  formData.set('password', password);
  return request('/login', { method: 'POST', body: formData });
}

export async function addHall(hallName) {
  const formData = new FormData();
  formData.set('hallName', hallName);
  return request('/hall', { method: 'POST', body: formData });
}

export async function deleteHall(hallId) {
  return request(`/hall/${hallId}`, { method: 'DELETE' });
}

export async function updateHallConfig(hallId, rowCount, placeCount, config) {
  const formData = new FormData();
  formData.set('rowCount', rowCount.toString());
  formData.set('placeCount', placeCount.toString());
  formData.set('config', JSON.stringify(config));
  return request(`/hall/${hallId}`, { method: 'POST', body: formData });
}

export async function updateHallPrices(hallId, priceStandart, priceVip) {
  const formData = new FormData();
  formData.set('priceStandart', priceStandart.toString());
  formData.set('priceVip', priceVip.toString());
  return request(`/price/${hallId}`, { method: 'POST', body: formData });
}

export async function toggleHallOpen(hallId, hallOpen) {
  const formData = new FormData();
  formData.set('hallOpen', hallOpen.toString());
  return request(`/open/${hallId}`, { method: 'POST', body: formData });
}

export async function addFilm(filmName, filmDuration, filmDescription, filmOrigin, filePoster) {
  const formData = new FormData();
  formData.set('filmName', filmName);
  formData.set('filmDuration', filmDuration.toString());
  formData.set('filmDescription', filmDescription);
  formData.set('filmOrigin', filmOrigin);
  if (filePoster) {
    formData.set('filePoster', filePoster);
  }
  return request('/film', { method: 'POST', body: formData });
}

export async function deleteFilm(filmId) {
  return request(`/film/${filmId}`, { method: 'DELETE' });
}

export async function addSeance(seanceHallid, seanceFilmid, seanceTime) {
  const formData = new FormData();
  formData.set('seanceHallid', seanceHallid.toString());
  formData.set('seanceFilmid', seanceFilmid.toString());
  formData.set('seanceTime', seanceTime);
  return request('/seance', { method: 'POST', body: formData });
}

export async function deleteSeance(seanceId) {
  return request(`/seance/${seanceId}`, { method: 'DELETE' });
}