import { URL } from "./constants";

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((err) => Promise.reject(err));
};

const getToken = () => localStorage.getItem("auth_token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  authorization: `Token ${getToken()}`,
});

export const registerUser = (username, password) => {
  return fetch(`${URL}/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  }).then(checkResponse);
};

export const loginUser = (username, password) => {
  return fetch(`${URL}/api/token/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then(checkResponse)
    .then((data) => {
      if (data.auth_token) {
        localStorage.setItem("auth_token", data.auth_token);
        return data;
      }
      return null;
    });
};

export const logoutUser = () => {
  return fetch(`${URL}/api/token/logout/`, {
    method: "POST",
    headers: authHeaders(),
  }).then((res) => {
    if (res.status === 204) {
      localStorage.removeItem("auth_token");
      return res;
    }
    return null;
  });
};

export const getUser = () => {
  return fetch(`${URL}/api/users/me/`, {
    method: "GET",
    headers: authHeaders(),
  }).then(checkResponse);
};

export const getCards = (page = 1) => {
  return fetch(`${URL}/api/cats/?page=${page}`, {
    method: "GET",
    headers: authHeaders(),
  }).then(checkResponse);
};

export const getCard = (id) => {
  return fetch(`${URL}/api/cats/${id}/`, {
    method: "GET",
    headers: authHeaders(),
  }).then(checkResponse);
};

export const sendCard = (card) => {
  const { achievements, ...cardWithoutAchievements } = card;
  return fetch(`${URL}/api/cats/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(cardWithoutAchievements),
  }).then(checkResponse);
};

export const updateCard = (card, id) => {
  const { achievements, ...cardWithoutAchievements } = card;
  return fetch(`${URL}/api/cats/${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(cardWithoutAchievements),
  }).then(checkResponse);
};

export const deleteCard = (id) => {
  return fetch(`${URL}/api/cats/${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then((res) => {
    if (res.status === 204) {
      return { status: true };
    }
    return { status: false };
  });
};

export const getCollections = (page = 1, filters = {}) => {
  let url = `${URL}/api/collections/?page=${page}`;
  if (filters.category) {
    url += `&category=${filters.category}`;
  }
  if (filters.sort === 'popular') {
    url += `&sort=popular`;
  }
  return fetch(url, {
    method: "GET",
    headers: authHeaders(),
  }).then(checkResponse);
};

export const getPopularCollections = () => {
  return fetch(`${URL}/api/collections/popular/`, {
    method: "GET",
    headers: authHeaders(),
  }).then(checkResponse);
};

export const getCollection = (id) => {
  return fetch(`${URL}/api/collections/${id}/`, {
    method: "GET",
    headers: authHeaders(),
  }).then(checkResponse);
};

export const createCollection = (collection) => {
  return fetch(`${URL}/api/collections/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(collection),
  }).then(checkResponse);
};

export const updateCollection = (collection, id) => {
  return fetch(`${URL}/api/collections/${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(collection),
  }).then(checkResponse);
};

export const deleteCollection = (id) => {
  return fetch(`${URL}/api/collections/${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then((res) => {
    if (res.status === 204) {
      return { status: true };
    }
    return { status: false };
  });
};

export const likeCollection = (id) => {
  return fetch(`${URL}/api/collections/${id}/like/`, {
    method: "POST",
    headers: authHeaders(),
  }).then(checkResponse);
};

export const unlikeCollection = (id) => {
  return fetch(`${URL}/api/collections/${id}/unlike/`, {
    method: "POST",
    headers: authHeaders(),
  }).then(checkResponse);
};

export const addCatToCollection = (collectionId, catId) => {
  return fetch(`${URL}/api/collections/${collectionId}/add_cat/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ cat_id: catId }),
  }).then(checkResponse);
};

export const removeCatFromCollection = (collectionId, catId) => {
  return fetch(`${URL}/api/collections/${collectionId}/remove_cat/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ cat_id: catId }),
  }).then(checkResponse);
};
export const getAllCats = async () => {
  let allCats = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    try {
      const response = await fetch(`${URL}/api/cats/?page=${page}`, {
        method: "GET",
        headers: authHeaders(),
      });
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        allCats = [...allCats, ...data.results];
      }

      hasNext = data.next !== null;
      page++;
    } catch (err) {
      console.error("Ошибка загрузки страницы котиков:", err);
      hasNext = false;
    }
  }

  return allCats;
};
export const getCollectionCats = (collectionId, page = 1) => {
  return fetch(`${URL}/api/collections/${collectionId}/cats_paginated/?page=${page}`, {
    method: "GET",
    headers: authHeaders(),
  }).then(checkResponse);
};