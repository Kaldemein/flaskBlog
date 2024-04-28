const BASE_URL = 'http://localhost:5000';

//response handler
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'something went wrong');
  } else return await response.json();
};

//fetching data
export const fetchArticles = async () => {
  const response = await fetch(`${BASE_URL}/get`);
  return await handleResponse(response);
};

//create method
export const createArticle = async (articleData) => {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articleData),
  });
  return await handleResponse(response);
};

//upadte methon
export const updateArticles = async (articleId, articleData) => {
  const response = await fetch(`${BASE_URL}/update/${articleId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articleData),
  });
  return await handleResponse(response);
};

//delete method
export const deleteArticle = async (articleId) => {
  const response = await fetch(`${BASE_URL}/delete/${articleId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await handleResponse(response);
};
