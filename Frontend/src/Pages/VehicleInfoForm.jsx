import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton, Snackbar, Card, CardContent, CardActions, Alert } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const VehicleInfoForm = () => {
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [maxPictures, setMaxPictures] = useState(1);
  const [pictures, setPictures] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [modelError, setModelError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cityError, setCityError] = useState('');
  const [maxPicturesError, setMaxPicturesError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect triggered');
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  const handlePictureChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + pictures.length > maxPictures) {
      setGeneralError(`You can only upload up to ${maxPictures} pictures.`);
    } else {
      setPictures(prevPictures => [...prevPictures, ...files]);
      setGeneralError('');

      files.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setPreviews(prevPreviews => [...prevPreviews, reader.result]);
        };
      });
    }
  };

  const handleRemovePicture = (index) => {
    setPictures(prevPictures => prevPictures.filter((_, i) => i !== index));
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let isValid = true;
    setModelError('');
    setPriceError('');
    setPhoneError('');
    setCityError('');
    setMaxPicturesError('');
    setGeneralError('');

    if (model.length < 3) {
      setModelError('Car model must be at least 3 characters long');
      isValid = false;
    }
    if (!price || isNaN(price) || price <= 0) {
      setPriceError('Price must be a positive number');
      isValid = false;
    }
    if (!phone || !/^\d{11}$/.test(phone)) {
      setPhoneError('Phone number must be exactly 11 digits');
      isValid = false;
    }
    if (!city || !/^[A-Za-z\s]+$/.test(city)) {
      setCityError('City must contain only alphabets');
      isValid = false;
    }
    if (!maxPictures || isNaN(maxPictures) || maxPictures < 1 || maxPictures > 10) {
      setMaxPicturesError('Number of pictures must be a number between 1 and 10');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('model', model);
    formData.append('price', price);
    formData.append('phone', phone);
    formData.append('city', city);
    pictures.forEach((picture) => {
      formData.append('pictures', picture);
    });

    const token = localStorage.getItem('token');
    console.log('Sending token:', token);

    try {
      const response = await axios.post('https://backend1-9zlm.onrender.com/api/vehicles/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Server response:', response.data);
      setSuccessMessage('Data submitted to the DB successfully!');
      setOpenSnackbar(true);
      setModel('');
      setPrice('');
      setPhone('');
      setCity('');
      setMaxPictures(1);
      setPictures([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error response:', err.response);
      if (err.response) {
        console.error('Error data:', err.response.data);
      }
      setGeneralError('Failed to submit the form');
    }
  };

  const handleInputChange = (setter, setError) => (e) => {
    setError('');
    setter(e.target.value);
  };

  const incrementPictures = () => {
    if (maxPictures < 10) {
      setMaxPictures(maxPictures + 1);
    }
  };

  const decrementPictures = () => {
    if (maxPictures > 1) {
      setMaxPictures(maxPictures - 1);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ marginTop: '20px', padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>Vehicle Information</Typography>
        <CardContent>
          <TextField
            label="Car Model"
            fullWidth
            value={model}
            onChange={handleInputChange(setModel, setModelError)}
            margin="normal"
            error={!!modelError}
            helperText={modelError}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={handleInputChange(setPrice, setPriceError)}
            margin="normal"
            error={!!priceError}
            helperText={priceError}
          />
          <TextField
            label="Phone Number"
            type="text"
            fullWidth
            value={phone}
            onChange={handleInputChange(setPhone, setPhoneError)}
            margin="normal"
            inputProps={{ maxLength: 11 }}
            error={!!phoneError}
            helperText={phoneError}
          />
          <TextField
            label="City"
            type="text"
            fullWidth
            value={city}
            onChange={handleInputChange(setCity, setCityError)}
            margin="normal"
            error={!!cityError}
            helperText={cityError}
          />
          <Box display="flex" alignItems="center" margin="normal">
            <Typography>Number of Pictures: </Typography>
            <Button 
              onClick={decrementPictures} 
              disabled={maxPictures <= 1} 
              style={{ margin: '0 10px', backgroundColor: 'red', color: 'white', fontSize: '18px' }}
            >
              -
            </Button>
            <Typography>{maxPictures}</Typography>
            <Button 
              onClick={incrementPictures} 
              disabled={maxPictures >= 10} 
              style={{ margin: '0 10px', backgroundColor: 'green', color: 'white', fontSize: '18px' }}
            >
              +
            </Button>
          </Box>
          <input
            type="file"
            multiple
            onChange={handlePictureChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" style={{ display: 'block', marginTop: '20px' }}>
            <Button variant="contained" component="span" style={{ backgroundColor: 'gray', color: 'white' }}>
              Choose Files
            </Button>
          </label>
          {previews.length > 0 && (
            <Box display="flex" flexWrap="wrap" mt={2}>
              {previews.map((preview, index) => (
                <Box key={index} position="relative" m={1}>
                  <img src={preview} alt={`Preview ${index}`} width="100" height="100" />
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleRemovePicture(index)}
                    style={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <DeleteIcon style={{ color: 'red' }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          {generalError && <Typography color="error">{generalError}</Typography>}
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="mt-4"
            fullWidth
          >
            Submit
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VehicleInfoForm;
