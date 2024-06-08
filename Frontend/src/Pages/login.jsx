import React, { useState } from "react";
import { Container, TextField, Button, Typography, Grid, Card, CardContent, CardActions, Snackbar, Alert } from '@mui/material';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login({ setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is incorrect');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

      if (response.data) {
        setLoggedIn(true);
        const { token } = response.data;
        localStorage.setItem('token', token);
        setSnackbarMessage('User logged in successfully');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/vehicle-info');
        }, 1500);
      } else {
        setEmailError('Email is incorrect');
        setPasswordError('Password is incorrect');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        const errorMessage = err.response.data.message;
        if (errorMessage.toLowerCase().includes('email')) {
          setEmailError(errorMessage);
        } else if (errorMessage.toLowerCase().includes('password')) {
          setPasswordError(errorMessage);
        } else {
          setEmailError('Email is incorrect');
          setPasswordError('Password is incorrect');
        }
      } else {
        setEmailError('Email is incorrect');
        setPasswordError('Password is incorrect');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" align="center" gutterBottom>
                Login
              </Typography>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                error={!!passwordError}
                helperText={passwordError}
              />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                fullWidth
                style={{ padding: '10px 0', fontSize: '16px' }}
              >
                Login
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
