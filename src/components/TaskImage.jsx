import { CardMedia } from '@mui/material';
import { getTaskImage } from '../utils/imageUtils';

function TaskImage({ image, title, height = 140 }) {
  return (
    <CardMedia
      component="img"
      height={height}
      image={getTaskImage(image)}
      alt={title || 'Task image'}
      sx={{
        objectFit: 'cover',
        bgcolor: 'background.default'
      }}
    />
  );
}

export default TaskImage; 