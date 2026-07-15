import { 
  FC,
  ButtonHTMLAttributes,
  Fragment,
  useMemo
} from 'react';
import styles from './CustomButton.module.css';

type ButtonProps = {
  text?: string;
  loading?: boolean;
  padding?: string | number;
  bgColor?: string;
  bgActiveColor?: string;
  bgHoverColor?: string;
}

type CSSVariables = {
    '--bg-color'?: string;
    '--bg-active'?: string;
    '--bg-hover'?: string;
    '--padding'?: string | number;
}

export const CustomButton: FC<ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps> = ({
    children,
    text = undefined,
    loading = false,
    bgColor = undefined,
    bgActiveColor = undefined, 
    bgHoverColor = undefined,
    ...props
}) => {
  const style: CSSVariables & React.CSSProperties = useMemo(() => ({
    '--bg-color': bgColor,
    '--bg-active': bgActiveColor,
    '--bg-hover': bgHoverColor,
    '--padding': props?.padding,
  }), [bgActiveColor, bgHoverColor, props?.padding]);

  return (
    <button 
      className={styles.button}
      style={style}
      {...props}
    >
      {loading ? (
        <Fragment>
          <p className={styles.textLoader}>Пожалуйста, подождите...</p>
          <i className={styles.loaderCircle} />
        </Fragment>
      ) : (
        <>{text || children}</>
      )}
    </button>
  )
}

