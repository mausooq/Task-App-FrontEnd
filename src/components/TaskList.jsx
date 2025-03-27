import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    Grid,
    IconButton,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { TaskService } from '../services/TaskService';
import TaskForm from './TaskForm';
import TaskImage from './TaskImage';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const data = await TaskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await TaskService.deleteTask(id);
        setTasks(tasks.filter(task => task._id !== id));
      } catch (error) {
        setError('Failed to delete task');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleTaskSaved = () => {
    fetchTasks();
    handleCloseDialog();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Tasks</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add New Task
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card>
              <TaskImage image={task.image} title={task.title} />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {task.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={task.status} 
                    color={
                      task.status === 'Done' ? 'success' : 
                      task.status === 'In-Progress' ? 'warning' : 'default'
                    }
                    size="small"
                  />
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(task._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <TaskForm 
          task={selectedTask}
          onSave={handleTaskSaved}
          onCancel={handleCloseDialog}
        />
      </Dialog>
    </Box>
  );
}

export default TaskList; 