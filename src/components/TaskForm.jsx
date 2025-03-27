import {
    Alert,
    Box,
    Button,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import defaultTaskImage from '../assets/taskImage.png';
import { TaskService } from '../services/TaskService';

function TaskForm({ task, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    status: 'pending',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        date: task.date?.split('T')[0] || '',
        status: task.status,
        image: null
      });
      setImagePreview(task.image === 'taskImage.png' ? defaultTaskImage : task.image);
    } else {
      setImagePreview(defaultTaskImage);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (task) {
        await TaskService.updateTask(task._id, formData);
        if (formData.image) {
          await TaskService.updateTaskImage(task._id, formData.image);
        }
      } else {
        await TaskService.createTask(formData);
      }
      onSave();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            name="date"
            label="Due Date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />
            <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    labelId="status-label"
                    id="status-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                    label="Status"  
                >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In-Progress">In-Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                </Select>
        </FormControl>
          {imagePreview && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px',
                  objectFit: 'cover'
                }}
              />
            </Box>
          )}
          <Button
            variant="contained"
            component="label"
            fullWidth
            disabled={loading}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (task ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Box>
  );
}

export default TaskForm; 