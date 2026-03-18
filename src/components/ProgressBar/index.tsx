import { FC } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

type TElemOfStatus = {
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  icon: JSX.Element;
  text: string;
};

type TMapStatusProgress = Record<string, TElemOfStatus>

export const getStatusProgress = (status: string): TElemOfStatus => {
  const mapStatusProgress: TMapStatusProgress = {
    COMPLETED: {
      color: 'success',
      icon: <CheckCircleIcon />,
      text: 'Все файлы отправлены'
    },
    PARTIALLY_COMPLETED: {
      color: 'warning',
      icon: <WarningIcon />,
      text: 'Часть файлов отправлена'
    },
    FAILED: {
      color: 'error',
      icon: <ErrorIcon/>,
      text: 'Ошибка отправки'
    },
    PENDING: {
      color: 'info',
      icon: <PlayCircleIcon />,
      text: 'Отправка файлов',
    },
    DEFAULT: {
      color: 'primary',
      icon: <ScheduleIcon />,
      text: 'Ожидание обработки'
    },
    CANCELLED: {
      color: 'secondary',
      icon: <WarningIcon />,
      text: 'Прервано пользователем'
    }
  };
  return mapStatusProgress?.[status] || mapStatusProgress.DEFAULT;
}

type TProgressBarProps = {
  overallStatus: 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED' | 'PENDING' | 'DEFAULT' | 'CANCELLED';
  completedTargets: number;
  totalTargets: number;
  progress?: number;
}

export const ProgressBar: FC<TProgressBarProps> = ({
  overallStatus,
  completedTargets = 0,
  totalTargets,
  progress = 0
}) => {
  const { color, icon, text } = getStatusProgress(overallStatus);

  return (
    <Card 
      sx={{ 
        mb: 3,
        width: '100% !important',       
      }}
    >
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box display='flex' alignItems='center' gap={1}>
            {icon}
            <Typography variant='h6' component='div'>
              {text}
            </Typography>
          </Box>
          <Chip
            label={`${completedTargets || 0} / ${totalTargets || 0}`}
            variant='outlined'
            color={color}
          />
        </Box>
        <LinearProgress 
          variant='determinate'
          value={progress}
          color={color as LinearProgressProps['color']}
          sx={{ height: 10, borderRadius: 5, mb: 2}}
        />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {progress}% завершено
        </Typography>  
      </CardContent>
    </Card>
  )
}

