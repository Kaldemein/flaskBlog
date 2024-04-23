export const fetchArticles = async () => {
  const response = await fetch('http://localhost:5000/get');
  const articles = await response.json();
  return articles;
};

export const updateArticles = async (articleId, articleData) => {
  const response = await fetch(
    `http://localhost:5000/update/${articleId}/`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    }
  );
  const updatedArticle = await response.json();
  return updatedArticle;
};
