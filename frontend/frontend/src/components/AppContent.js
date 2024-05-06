import { useState } from 'react';
import React from 'react';

import ArticleList from './ArticleList';
import ButtonAppBar from './ButtonAppBar';
import Form from './Form';
import RegistrationForm from './LoginForm';

import { fetchArticles } from './APIService';
import { deleteArticle } from './APIService';
import { createArticle } from './APIService';

import { Box } from '@mui/material';
import Fade from '@mui/material/Fade';

export default function AppContent({
  error,
  articles,
  editArticle,
  onDeleteArticle,
  articleForEdit,
  closeEditArticle,
  onUpdate,
}) {
  return (
    <Box>
      <Box display="flex" className="App">
        {error && <div className="error">{error}</div>}

        <ArticleList
          articles={articles}
          editArticle={editArticle}
          onDeleteArticle={onDeleteArticle}
          articleForEdit={articleForEdit}
        />
        <Fade in={!!articleForEdit}>
          <div>
            {articleForEdit && (
              <Form
                articleForEdit={articleForEdit}
                closeEditArticle={closeEditArticle}
                onUpdate={onUpdate}
              />
            )}
          </div>
        </Fade>
      </Box>
    </Box>
  );
}
