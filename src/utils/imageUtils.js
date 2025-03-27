import defaultTaskImage from '../assets/taskImage.png';

export const getTaskImage = (imageUrl) => {
  if (!imageUrl || imageUrl === 'taskImage.png') {
    return defaultTaskImage;
  }
  return imageUrl;
}; 