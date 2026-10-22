import { useRef, useEffect, useState } from 'react';

export const ViewEditingInputDatainCell = ({
  row,
  fieldsObj,
  userId,
  callbackPermissionToEditingInput,
}) => {
  const wrapper = useRef(null);
  const cellDiv = useRef(null);
  const aloneSpan = useRef(null);
  const firstColumnGrid = useRef(null);
  const secondColumnGrid = useRef(null);
  const [anchorRounded, setAnchorEl] = useState(null);
  const [isOpenPopper, openPopper] = useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverFlownGrid =
      wrapper.current?.scrollWidth <
      firstColumnGrid.current?.scrollWidth +
        secondColumnGrid.current?.scrollWidth +
        10;
    const isCurrentlyOverFlownSpan =
      wrapper.current?.scrollWidth < aloneSpan.current?.scrollWidth;

    setAnchorEl(cellDiv.current);
    openPopper(isCurrentlyOverFlownGrid || isCurrentlyOverFlownSpan);
  };

  const handleMouseLeave = () => {
    openPopper(false);
  };

  useEffect(() => {
    function handleKeyDown(nativeEvent) {
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        openPopper(false);
        setAnchorEl(null);
        document.removeEventListener('keydown', handleKeyDown);
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <div>content</div>;
};
