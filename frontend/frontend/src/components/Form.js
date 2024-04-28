import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { updateArticles } from './APIService';

export default function Form({ editedArticle, closeEditArticle }) {
  const [title, setTitle] = useState('');
  const [prevTitle, setPrevTitle] = useState('');

  const [body, setBody] = useState('');
  const [prevBody, setPrevBody] = useState('');

  useEffect(() => {
    setTitle(editedArticle.title);
    setPrevTitle(editedArticle.title);
    setBody(editedArticle.body);
    setPrevBody(editedArticle.body);
  }, [editedArticle]);

  const onUpdate = () => {
    updateArticles(editedArticle.id, { title, body })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  return (
    <Card
      sx={{ width: 800, height: 300, marginTop: 2, marginLeft: 2 }}
    >
      <CardMedia
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '100%' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <h3>Edit your article</h3>
            <TextField
              id="title"
              label="New body"
              multiline
              maxRows={4}
              variant="standard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
              id="body"
              label="New body"
              multiline
              maxRows={4}
              variant="standard"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </Box>
      </CardContent>
      <Box display="flex" justifyContent="right">
        <Box
          display="flex"
          justifyContent="space-between"
          px={{ margin: 10, width: 235 }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<CloseIcon />}
            onClick={() => closeEditArticle()}
          >
            Cancel
          </Button>
          <Button
            sx={{
              bgcolor: '#758be6',
              '&:hover': {
                backgroundColor: '#5f7bed', // Изменение фона кнопки
              },
            }}
            onClick={() => onUpdate()}
            variant="contained"
            endIcon={<CheckIcon />}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
