const BASE_URL = 'http://localhost:5000';

//response handler
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'something went wrong');
  } else return await response.json();
};

//login
export const loginUser = async (userData, navigate) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message); // Возвращаем сообщение об ошибке из response
  }
  const data = await response.json();
  localStorage.setItem('token', data.access_token); // Данные сохраняются в localStorage только при успешном ответе
  navigate('/');
};

//register
export const registerUser = async (userData, navigate) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = response.json();
  }
  const data = await response.json();
  navigate('/');
  console.log(data.message);
  return data;
};

//fetching data
export const fetchArticles = async () => {
  const response = await fetch(`${BASE_URL}/get`);
  return await handleResponse(response);
};

// prettier-ignore
//create method
export const createArticle = async (articleData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': `application/json`,
      'Authorization': `${token}`,
    },
    body: JSON.stringify(articleData),
  });
  return await handleResponse(response);
};

//upadte methon
export const updateArticles = async (articleId, articleData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/update/${articleId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify(articleData),
  });
  return await handleResponse(response);
};

//delete method
export const deleteArticle = async (articleId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/delete/${articleId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  });
  return await handleResponse(response);
};
