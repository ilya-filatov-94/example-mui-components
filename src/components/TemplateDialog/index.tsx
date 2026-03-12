import { FC, KeyboardEventHandler } from 'react';
import { styled as materialStyled } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Icon from '@mui/material/Icon';
import WarningIcon from '@mui/icons-material/Warning';
import styles from './TemplateDialog.module.css';

const StyledDialog = materialStyled(Dialog)(({
    width,
    borderstyle,
    paddingstyle = undefined
}: DialogProps & {
    width: string | number;
    borderstyle?: string | number;
    paddingstyle?: string | number;
}) => ({
    '& .MuiDialogContent-root': {
        padding: paddingstyle ?? '0 16px 16px 16px',
        overflowX: 'auto',
    },
    '& .MuiDialog-container': {
        '& .MuiPaper-root': {
            left: '30px',
            maxWidth: width || '600px',
            width: width || undefined,
            border: borderstyle || undefined,
        }
    }
}));

const StyledHeaderDialog = materialStyled(DialogTitle)(() => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    gap: '20px',
    margin: '0.6rem 0.5rem 0.3rem 1rem',
    padding: 0,
}));

type TemplateDialogProps = {
    isOpenDialog: boolean;
    openDialog: (isOpen: boolean) => void;
    type?: string;
    header?: string;
    content?: JSX.Element | string;
    footer?: JSX.Element;
    width: string | number;
    isModal?: boolean;
    handleKeyEvent?: KeyboardEventHandler<HTMLDivElement>,
    borderstyle?: string | number;
    paddingstyle?: string | number;
}   

export const TemplateDialog: FC<TemplateDialogProps> = ({
    isOpenDialog,
    openDialog,
    type = 'info',
    header = 'Диалог',
    content = '',
    footer = undefined,
    width,
    isModal = false,
    handleKeyEvent = undefined,
    borderstyle = undefined,
    paddingstyle = undefined,
}) => {
  const handleCloseDialog = () => {
    openDialog(false);
  }

  function getIconOfDialog(typeOfDialog: string | undefined) {
    switch (typeOfDialog) {
        case 'error': {
            return <ErrorOutlineOutlinedIcon sx={{ color: 'red' }} />;
        }
        case 'warning': {
            return (
                <Icon
                    sx={{
                      display: 'inline-block',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      backgroundSize: 'contain',
                      content: `url(${WarningIcon})`,
                    }}
                />
            )
        }
        case 'info': {
            return (
             <InfoOutlinedIcon
              sx={{
                color: '#0000ff',
                backgroundColor: '#fff',
              }}
             />
            )
        }
        default:
            return '';
    }
  }


  return (
    <StyledDialog
        onClose={isModal ? undefined : handleCloseDialog}
        aria-labelledby='customized-dialog'
        open={isOpenDialog}
        onKeyDown={handleKeyEvent}
        width={width}
        borderstyle={borderstyle}
        paddingstyle={paddingstyle}
    >
      <StyledHeaderDialog id='customized-dialog-title'>
        <div className={styles.wrapperHeaderDialog}>
            {getIconOfDialog(type)}
            {header}
        </div>
        {!isModal && (
            <IconButton 
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{
                    width: '30px',
                    heght: '30px',
                    padding: 0,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
        )}
      </StyledHeaderDialog>
      <DialogContent 
        sx={{
            padding: 0,
            width: '100%',
        }}>
            {content}
        </DialogContent>
        {footer && (
            <DialogActions
                sx={{
                    padding: 0,
                    width: '100%',
                    justifyContent: 'center',
                }}
            >
                {footer}
            </DialogActions>
        )}
    </StyledDialog>
  )
}

