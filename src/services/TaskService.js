import axios from 'axios';

const API_URL = 'https://task-app-mern-q6y2.onrender.com/api/tasks';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const TaskService = {
  getAllTasks: async () => {
    const response = await api.get('/');
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const formData = new FormData();
    Object.keys(taskData).forEach(key => {
      if (key === 'image') {
        if (taskData[key]) {
          formData.append('image', taskData[key]);
        }
      } else {
        formData.append(key, taskData[key]);
      }
    });
    
    const response = await api.post('/', formData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  updateTaskImage: async (id, image) => {
    const formData = new FormData();
    formData.append('image', image);
    const response = await api.put(`/${id}/image`, formData);
    return response.data;
  }
}; 