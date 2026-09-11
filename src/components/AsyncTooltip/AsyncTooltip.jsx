import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const TooltipPaper = styled.div`
  min-width: 300px;
  min-height: 250px;
  max-width: 500px;
  max-height: 400px;
  overflow: auto;
  padding: 0;
  background-color: #fff;
  color: #222;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  box-sizing: border-box;
`;

const LoaderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 250px;
`;

const ErrorBox = styled.div`
  padding: 12px 16px;
  color: #c62828;
`;

const BodyBox = styled.div`
  padding: 12px 16px;
  white-space: pre-wrap;
  word-break: break-word;
`;

export function AsyncHoverTooltip({
  children,
  url,
  cacheKey,
  renderContent,
  placement = 'top',
  emptyMessage = 'Нет данных',
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const cacheRef = useRef(new Map());
  const requestIdRef = useRef(0);
  const key = cacheKey ?? url;

  const handleEnter = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleLeave = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!open) return;
    if (loading || data || error) return; // уже загружено — не перезапускаем

    if (cacheRef.current.has(key)) {
      setData(cacheRef.current.get(key));
      return;
    }

    setData(null);
    setError(null);
    setLoading(true);

    const currentId = ++requestIdRef.current;
    let cancelled = false;

    (async () => {
      try {
        const response = await axios.get(url);
        if (cancelled || currentId !== requestIdRef.current) return;
        cacheRef.current.set(key, response.data);
        setData(response.data);
        setError(null);
      } catch (e) {
        if (cancelled || currentId !== requestIdRef.current) return;
        setError(e?.response?.data?.message || e?.message || 'Ошибка загрузки');
      } finally {
        if (!cancelled && currentId === requestIdRef.current) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, url, key, loading, data, error]);

  // при закрытии — сбрасываем всё, чтобы следующий hover показал лоадер снова
  useEffect(() => {
    if (open) return;
    setLoading(false);
    setData(null);
    setError(null);
  }, [open]);

  const contentKey = loading ? 'l' : error ? 'e' : data ? 'd' : 'n';

  let content;
  if (loading) {
    content = (
      <LoaderBox>
        <CircularProgress size={24} />
      </LoaderBox>
    );
  } else if (error) {
    content = <ErrorBox>{error}</ErrorBox>;
  } else if (data) {
    content = (
      <BodyBox>
        {renderContent ? renderContent(data) : JSON.stringify(data, null, 2)}
      </BodyBox>
    );
  } else {
    content = <BodyBox>{emptyMessage}</BodyBox>;
  }

  return (
    <>
      <span
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
        modifiers={[
          { name: 'preventOverflow', options: { boundary: 'viewport' } },
          {
            name: 'flip',
            options: { fallbackPlacements: ['bottom', 'right', 'left'] },
          },
          { name: 'offset', options: { offset: [0, 8] } },
        ]}
        sx={{ zIndex: 1500 }}
      >
        {({ TransitionProps }) => (
          <Fade
            {...TransitionProps}
            timeout={150}
          >
            <TooltipPaper key={contentKey}>{content}</TooltipPaper>
          </Fade>
        )}
      </Popper>
    </>
  );
}
