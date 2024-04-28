import './App.css';
import { useState } from 'react';
import React from 'react';

import ArticleList from './components/ArticleList';
import ButtonAppBar from './components/ButtonAppBar';
import Form from './components/Form';

import { fetchArticles } from './components/APIService';
import { deleteArticle } from './components/APIService';
import { createArticle } from './components/APIService';

import { Box } from '@mui/material';
import Fade from '@mui/material/Fade';

function App() {
  const [articles, setArticles] = useState([]);
  const [editedArticle, setEditedArticle] = useState(null);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    fetchArticles()
      .then((articles) => setArticles(articles))
      .catch((err) => console.log(err));
  }, []);

  const editArticle = (articleForEdit) => {
    setEditedArticle(articleForEdit);
  };

  const closeEditArticle = () => {
    setEditedArticle(null);
  };

  const onDeleteArticle = (articleId) => {
    deleteArticle(articleId).then(() => {
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== articleId)
      );
    });
  };

  const onCreateArticle = (articleData) => {
    createArticle(articleData)
      .then((newArticle) => {
        setArticles((prevArticles) => [...prevArticles, newArticle]);
        setError(null);
        console.log('then');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <Box>
      <ButtonAppBar onCreateArticle={onCreateArticle} />
      <Box display="flex" className="App">
        {error && <div className="error">{error}</div>}

        <ArticleList
          articles={articles}
          editArticle={editArticle}
          onDeleteArticle={onDeleteArticle}
        />
        <Fade in={!!editedArticle}>
          <div>
            {editedArticle && (
              <Form
                editedArticle={editedArticle}
                closeEditArticle={closeEditArticle}
              />
            )}
          </div>
        </Fade>
      </Box>
    </Box>
  );
}

export default App;
