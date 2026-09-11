import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { debounce } from '../../utils/debounce';
import { autoHighLightSpecialMatch, autoHighLightParse } from './autohighlight';

const LISTBOX_PADDING = 8; // px

const createTemplateSearchString = (objSearchParams, arrParams) => {
  if (!objSearchParams) return '';
  const parts = [];
  for (let i = 0; i < arrParams.length; i++) {
    const key = arrParams[i];
    if (key && key !== '') {
      const value = objSearchParams[key];
      if (value && typeof value === 'string' && !/^-+$/.test(value)) {
        parts.push(value);
      }
    }
  }
  return parts.join(' - ');
};

function renderRow(props) {
  const { data, index: indexRow, style } = props;
  const [serviceData, dataSet, state] = data[indexRow];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };
  const { key, ...optionProps } = serviceData;
  const chosenValueStr =
    state.chosenValue !== ''
      ? createTemplateSearchString(state.chosenValue, state.arrSearchParams)
      : '';
  const optionStr = createTemplateSearchString(dataSet, state.arrSearchParams);
  const matchesHighLights = autoHighLightSpecialMatch(
    optionStr,
    state.inputValue || '',
  );
  const partsHighLights = autoHighLightParse(optionStr, matchesHighLights);

  if (state.inputValue === '' || state.inputValue === chosenValueStr) {
    return (
      <Typography
        key={key}
        component="li"
        {...optionProps}
        noWrap
        style={inlineStyle}
      >
        {optionStr}
      </Typography>
    );
  }

  return (
    <li
      key={key}
      {...optionProps}
      style={{ ...inlineStyle, whiteSpace: 'nowrap' }}
    >
      {partsHighLights.map((part, index) => (
        <span
          key={`${key}_part_${optionStr}_${index}`}
          style={{
            fontWeight: part.highlight ? 700 : 400,
            whiteSpace: 'pre',
            backgroundColor: part.highlight ? '#ffe58f' : 'inherit',
          }}
        >
          {part.text}
        </span>
      ))}
    </li>
  );
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef((props, ref) => {
  const outerProps = useContext(OuterElementContext);

  return (
    <div
      ref={ref}
      {...props}
      {...outerProps}
    />
  );
});

function useResetCache(data) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);

  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(
  function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach(item => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    });

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
      noSsr: true,
    });

    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = () => itemSize;

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemData);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={index => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  },
);

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

export function AutoCompleteAsyncVirtualized({
  chosenValue,
  setChosenValue,
  listValues,
  getListValues,
  isLoadingState,
  setLoadingState,
  noOptionsText,
  placeholderText,
  arrSearchParams,
  error,
  validationFun,
  forceClearValue,
  minLengthValue = 0,
}) {
  const id = useId();
  const [isOpenAutoComplete, openAutoComplete] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const customFilterOptions = useCallback((options, { inputValue }) => {
    return options?.filter(item => {
      const templateItemString = createTemplateSearchString(
        item,
        arrSearchParams,
      );

      return templateItemString
        .toLowerCase()
        .includes(inputValue.toLowerCase());
    });
  }, []);

  useEffect(() => {
    if (forceClearValue) {
      setChosenValue('');
    }
  }, [forceClearValue, chosenValue]);

  useEffect(() => {
    if (!initialLoaded && !minLengthValue) {
      setLoadingState(true);
      getListValues('');
      setInitialLoaded(true);
    }
  }, []);

  const handleChangeValue = useCallback(
    debounce(e => {
      const newValue = e.target.value;

      if (minLengthValue && newValue?.length >= minLengthValue) {
        setLoadingState(true);
        getListValues(newValue);
      }
    }, 500),
    [],
  );

  return (
    <Autocomplete
      id={`asynchronous-autocomplete--virtualized-${id}`}
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          fontSize: '0.875rem',
          padding: '5px 0',
          backgroundColor: '#fff',
          margin: 0,
          '& .MuiAutoComplete-input': {
            pading: '0 12px 0 0',
            margin: 0,
          },
        },
      }}
      disableListWrap
      forcePopupIcon={false}
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      value={chosenValue}
      onChange={(event, newChosenValue) => {
        setChosenValue(newChosenValue);

        if (typeof validationFun === 'function') {
          validationFun(
            createTemplateSearchString(newChosenValue, arrSearchParams),
          );
        }
      }}
      open={isOpenAutoComplete}
      onOpen={(event, newChosenValue) => {
        if (minLengthValue && event.target.value?.length >= minLengthValue) {
          setLoadingState(true);
          getListValues(event.target.value);
        } else if (!initialLoaded || listValues?.length === 0) {
          setLoadingState(true);
          getListValues('');
        }

        openAutoComplete(true);
      }}
      onClose={() => {
        openAutoComplete(false);
      }}
      disableClearable={false}
      clearOnBlur={false}
      noOptionsText={noOptionsText}
      filterOptions={customFilterOptions}
      isOptionEqualToValue={(option, value) => {
        return (
          createTemplateSearchString(option, arrSearchParams).toLowerCase() ===
          createTemplateSearchString(value, arrSearchParams).toLowerCase()
        );
      }}
      getOptionLabel={listItems =>
        createTemplateSearchString(listItems, arrSearchParams)
      }
      options={listValues}
      loading={isLoadingState}
      renderInput={params => (
        <TextField
          error={error?.state || false}
          helperText={error?.msg}
          {...params}
          InputProps={{
            ...params.InputProps,
            placeholder: placeholderText,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ width: '20px', height: '20px', marginLeft: '12px' }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {isLoadingState ? (
                  <CircularProgress
                    color="inherit"
                    size={20}
                  />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          onBlur={e => {
            const newInputValue = e.target.value;
            if (typeof validationFun === 'function') {
              validationFun(newInputValue);
            }
          }}
          onInput={e => {
            e.target.value = e.target.value.toString().slice(0, 1024);

            if (typeof validationFun === 'function') {
              validationFun(e.target.value);
            }
          }}
          onChange={event => handleChangeValue(event)}
        />
      )}
      renderOption={(props, option, state) => [
        props,
        option,
        { inputValue: state.inputValue, chosenValue, arrSearchParams },
      ]}
    />
  );
}
