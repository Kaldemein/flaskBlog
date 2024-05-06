import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/material';
import { loginUser } from './APIService';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ setAuthorized }) {
  const [password, setPassword] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const onLogin = async (userData) => {
    try {
      await loginUser(userData, navigate);
      setAuthorized(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <Box
      display="flex"
      height="90vh"
      justifyContent="center"
      alignItems="center"
    >
      {error ? <div>{error}</div> : null}
      <Card
        display="flex"
        justifyContent="space-between"
        sx={{ height: 300, padding: 3 }}
      >
        <CardContent
          display="flex"
          position="relative"
          justifyContent="space-between"
        >
          <h3>Login</h3>
          <div>
            <TextField
              label="Login"
              id="login"
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ marginTop: 3 }}
            />
          </div>
          <div>
            <TextField
              label="Password"
              id="password"
              size="small"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginTop: 2 }}
            />
          </div>
          <Box display="flex" justifyContent="end">
            <Button
              onClick={() => onLogin({ username, password })}
              sx={{
                marginTop: 2,
                bgcolor: '#758be6',
                '&:hover': {
                  backgroundColor: '#5f7bed', // Изменение фона кнопки
                },
              }}
              variant="contained"
              // endIcon={<EditIcon />}
            >
              Continue
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
