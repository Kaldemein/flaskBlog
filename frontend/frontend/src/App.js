import './App.css';
import { useState } from 'react';
import React from 'react';
import ArticleList from './components/ArticleList';
import Form from './components/Form';
import { fetchArticles } from './components/APIService';
import { Box } from '@mui/material';
function App() {
  const [articles, setArticles] = useState([]);
  const [editedArticle, setEditedArticle] = useState(null);

  React.useEffect(() => {
    fetchArticles()
      .then((articles) => setArticles(articles))
      .catch((err) => console.log(err));
  }, []);

  const editArticle = (articleForEdit) => {
    setEditedArticle(articleForEdit);
    // console.log(editedArticle);
  };

  return (
    <Box display="flex" className="App">
      <ArticleList articles={articles} editArticle={editArticle} />
      {editedArticle ? <Form editedArticle={editedArticle} /> : null}
    </Box>
  );
}

export default App;
