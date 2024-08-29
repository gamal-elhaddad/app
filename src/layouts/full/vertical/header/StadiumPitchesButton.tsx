import React, { useEffect, useState } from 'react';

import { Box, Tabs, Tab, Typography } from '@mui/material';
import { AppState, useDispatch, useSelector } from 'src/store/Store';
import { setFemaleFriendly, setPitch } from 'src/store/apps/config/ConfigSlice';
import { Price } from 'src/types/apps/stadium';

const StadiumTabs = () => {
  const [value, setValue] = useState(0);

  const pitches = useSelector((state: AppState) => state.configReducer.pitches);
  const selectedPitch = useSelector((state: AppState) => state.configReducer.pitch);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPitch) {
      const index = pitches.findIndex(pitch => pitch.id === selectedPitch.id);
      setValue(index !== -1 ? index : 0);
    }
  }, [selectedPitch, pitches]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const femaleFriendly: Price[] = pitches[newValue]?.prices?.filter(item => item.female_friendly)
    dispatch(setPitch(pitches[newValue]));
    dispatch(setFemaleFriendly(femaleFriendly));

  };

  return (
    <Box sx={{ width: '700px', overflow: 'hidden', ml: '25px' }}>
      <Typography variant="h6" sx={{ mb: 2, mt: "25px" }}>
        Pitches
      </Typography>
      <Tabs
        sx={{
          maxWidth: '100%',
          '& .MuiTabs-flexContainer': {
            maxWidth: '100%',
          },
        }}
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="stadium tabs"
      >
        {pitches?.map((pitch, index) => (
          <Tab key={index} label={`${pitch.lable} (${pitch.pitch_size} vs ${pitch.pitch_size})`} sx={{ minWidth: 'auto' }} />
        ))}
      </Tabs>
    </Box>
  );
};

export default StadiumTabs;