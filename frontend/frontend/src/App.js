import './App.css';
import { useState } from 'react';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import ButtonAppBar from './components/ButtonAppBar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import AppContent from './components/AppContent';

import { fetchArticles } from './components/APIService';
import { deleteArticle } from './components/APIService';
import { createArticle } from './components/APIService';
import { updateArticles } from './components/APIService';

import { createTheme, ThemeProvider } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#d9dfff', // Основной цвет для кнопок
//       color:
//     },
//     secondary: {
//       main: '#f50057', // Вторичный цвет для кнопок
//     },
//   },
//   typography: {
//     button: {
//       // textTransform: 'none', // Отключаем автоматическое преобразование текста кнопок
//     },
//   },
// });

function App() {
  const [articles, setArticles] = useState([]);
  const [articleForEdit, setArticleForEdit] = useState(null);
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  React.useEffect(() => {
    fetchArticles()
      .then((articles) => setArticles(articles))
      .catch((err) => console.log(err));
  }, []);

  const editArticle = (articleForEdit) => {
    setArticleForEdit(articleForEdit);
  };

  const onUpdate = (articleForEdit, { title, body }) => {
    updateArticles(articleForEdit.id, { title, body })
      .then((response) => {
        setArticles((prevArticles) => {
          return prevArticles.map((article) => {
            if (article.id === articleForEdit.id) {
              return { ...article, title, body };
            } else {
              return article; // Возвращаем неизмененный элемент
            }
          });
        });
        console.log(articles);
        setArticleForEdit(null);
      })
      .catch((err) => setError(err.message));
  };

  const closeEditArticle = () => {
    setArticleForEdit(null);
  };

  const onDeleteArticle = (articleId) => {
    deleteArticle(articleId)
      .then(() => {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== articleId)
        );
      })
      .catch((err) => setError(err.message));
  };

  const onCreateArticle = (articleData) => {
    createArticle(articleData)
      .then((newArticle) => {
        setArticles((prevArticles) => [...prevArticles, newArticle]);
        alert('Article successfully created');
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  };
  return (
    <Router>
      <ButtonAppBar
        onCreateArticle={onCreateArticle}
        authorized={authorized}
        setAuthorized={setAuthorized}
      />
      <Routes>
        <Route
          path="/login"
          element={<LoginForm setAuthorized={setAuthorized} />}
        />
        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/"
          element={
            <AppContent
              onCreateArticle={onCreateArticle}
              error={error}
              articles={articles}
              editArticle={editArticle}
              onDeleteArticle={onDeleteArticle}
              articleForEdit={articleForEdit}
              closeEditArticle={closeEditArticle}
              onUpdate={onUpdate}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
