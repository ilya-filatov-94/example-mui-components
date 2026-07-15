import { Fragment, ButtonHTMLAttributes, forwardRef, useMemo } from 'react';
import styles from './CustomButton.module.css';

type ButtonVariant = 'primary' | 'reset'; // На будущее

type CSSVariables = {
  '--bg-color'?: string;
  '--bg-active'?: string;
  '--bg-hover'?: string;
  '--padding'?: string | number;
};

type ButtonProps = {
  text?: string;
  loading?: boolean;
  loadingText?: string;
  padding?: string | number;
  bgColor?: string;
  bgActiveColor?: string;
  bgHoverColor?: string;
};

export const CustomButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps
>(
  (
    {
      children,
      text,
      loading = false,
      loadingText = 'Пожалуйста, подождите...',
      bgColor = undefined,
      bgActiveColor = undefined,
      bgHoverColor = undefined,
      padding = undefined,
      ...restProps
    },
    ref,
  ) => {
    const style: CSSVariables & React.CSSProperties = useMemo(
      () => ({
        '--bg-color': bgColor,
        '--bg-active': bgActiveColor,
        '--bg-hover': bgHoverColor,
        '--padding': padding,
      }),
      [bgColor, bgActiveColor, bgHoverColor, padding],
    );

    return (
      <button
        ref={ref}
        className={styles.button}
        style={style}
        disabled={loading || restProps.disabled}
        aria-busy={loading}
        aria-label={loading ? loadingText : restProps['aria-label']}
        {...restProps}
      >
        {loading ? (
          <Fragment>
            <span>{loadingText}</span>
            <i
              className={styles.loaderCircle}
              aria-hidden="true"
            />
          </Fragment>
        ) : (
          (children ?? text)
        )}
      </button>
    );
  },
);
