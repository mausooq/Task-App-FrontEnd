import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await signup(formData);
      setSuccess(response.message);
      setTimeout(() => {
        navigate('/login');
      }, 10000); 
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography component="h1" variant="h5" align="center">
        Sign up
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please check your email to set up your password. 
            Redirecting to login page in 10 seconds...
          </Typography>
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="firstName"
          label="First Name"
          autoFocus
          value={formData.firstName}
          onChange={handleChange}
          disabled={loading || success}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          disabled={loading || success}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          disabled={loading || success}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading || success}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading || success}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign Up'
          )}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link 
            href="/login" 
            variant="body2"
            sx={{ pointerEvents: success ? 'none' : 'auto' }}
          >
            Already have an account? Sign in
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default Signup; 