import React, { useEffect, useState } from 'react';

import { Button, Menu, Box } from '@mui/material';
import { IconChevronDown } from '@tabler/icons';
import { useLazyFetchPitchesQuery, useLazyFetchStadiumsQuery } from 'src/services/stadiums';
import { AppState, useDispatch, useSelector } from 'src/store/Store';
import { setFemaleFriendly, setPitch, setPitches, setSelectedStadium, setStadiums } from 'src/store/apps/config/ConfigSlice';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Price, Stadium } from 'src/types/apps/stadium';


const StadiumSelectButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filteredStadiums, setFilteredStadiums] = useState<Stadium[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const [fetchStadiums] = useLazyFetchStadiumsQuery()
  const [fetchPitches] = useLazyFetchPitchesQuery()

  const stadiums = useSelector((state: AppState) => state.configReducer.stadiums)
  const selectedStadium = useSelector((state: AppState) => state.configReducer.selectedStadium)

  const dispatch = useDispatch()

  useEffect(() => {
    fetchStadiums(undefined, undefined).then((result) => {
      dispatch(setStadiums(result?.data?.data))
    })
  }, [])

  useEffect(() => {
    if (selectedStadium?.id) {
      fetchPitches({
        stadium_id: selectedStadium?.id
      }).then((result) => {
        const pitches = result.data?.data
        dispatch(setPitches(pitches));

        if (pitches && pitches?.length > 0) {
          dispatch(setPitch(pitches?.[0]));
          const femaleFriendly: Price[] = pitches[0]?.prices?.filter(item => item.female_friendly)
          dispatch(setFemaleFriendly(femaleFriendly));
        }
      })
    }
  }, [selectedStadium, dispatch, fetchPitches])


  useEffect(() => {
    setFilteredStadiums(stadiums)
  }, [stadiums])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFilteredStadiums(stadiums)
    setResetKey(prevKey => prevKey + 1);
  };

  const handleSelect = (stadium: Stadium) => {
    dispatch(setSelectedStadium(stadium))
    handleClose();
  };

  const handleFilter = (event: React.ChangeEvent<{}>, value: string) => {
    setInputValue(value);

    const searchTerms = value.toLowerCase().split(' ').filter(Boolean);
    const filtered = stadiums.filter((stadium) =>
      searchTerms.every((term) => stadium.name.toLowerCase().includes(term))
    );
    setFilteredStadiums(filtered);
  };

  return (
    <Box>
      <Button
        color="primary"
        onClick={handleClick}
        endIcon={<IconChevronDown />}
      >
        {selectedStadium ? selectedStadium.name : 'Select Stadium'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Autocomplete
            key={resetKey}
            options={filteredStadiums}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option: Stadium) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Stadiums"
                variant="outlined"
                fullWidth
              />
            )}
            onChange={(event, value) => {
              if (value) {
                handleSelect(value);
              }
            }}
            onInputChange={handleFilter}
            inputValue={inputValue}
            fullWidth
          />
        </Box>
      </Menu>
    </Box>
  );
};

export default StadiumSelectButton;