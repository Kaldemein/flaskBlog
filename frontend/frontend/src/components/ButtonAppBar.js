import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  // p: 4,
};

export default function ButtonAppBar({ onCreateArticle }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [title, setTitle] = React.useState(null);
  const [body, setBody] = React.useState(null);

  const onCreate = ({ title, body }) => {
    onCreateArticle({ title, body });
    setTitle(null);
    setBody(null);
    setOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ bgcolor: '#758be6', boxShadow: 'none' }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Blog
          </Typography>
          <div>
            <Button sx={{ color: 'white' }} onClick={handleOpen}>
              Create
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                >
                  <Card
                    sx={{
                      width: 800,
                      height: 300,
                    }}
                  >
                    <CardMedia
                      // sx={{ height: 80 }}
                      image="/static/images/cards/contemplative-reptile.jpg"
                      title="green iguana"
                    />
                    <CardContent>
                      <Box
                        component="form"
                        sx={{
                          '& .MuiTextField-root': {
                            m: 1,
                            width: '100%',
                          },
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <div>
                          <h3>Create new article</h3>
                          <TextField
                            id="standard-multiline-static"
                            label="Title"
                            multiline
                            maxRows={4}
                            variant="standard"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />

                          <TextField
                            id="standard-multiline-static"
                            label="Body"
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
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => onCreate({ title, body })}
                          variant="contained"
                          sx={{
                            bgcolor: '#758be6',
                            '&:hover': {
                              backgroundColor: '#5f7bed', // Изменение фона кнопки
                            },
                          }}
                          endIcon={<CheckIcon />}
                        >
                          Create
                        </Button>
                      </Box>
                    </Box>
                  </Card>{' '}
                </Typography>
              </Box>
            </Modal>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
