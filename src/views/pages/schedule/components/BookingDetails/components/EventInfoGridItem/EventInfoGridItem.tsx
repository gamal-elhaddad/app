import React from 'react';
import { Grid, Box, Typography, Tooltip } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import styles from './EventInfoGridItem.module.css';

interface EventInfoGridItemProps {
  Icon: SvgIconComponent;
  title: string;
  value: string | number;
  showTooltip?: boolean;
}


const EventInfoGridItem: React.FC<EventInfoGridItemProps> = ({ Icon, title, value, showTooltip }) => {
  const ValueComponent = (
    <Typography variant="h6">{value}</Typography>
  );

  return (
    <Grid item xs={4} className={styles.gridItem}>
      <Box className={styles.contentBox}>
        <Icon className={styles.icon} />
        <Box>
          <Typography variant="body2">{title}</Typography>
          {showTooltip ? (
            <Tooltip title={value.toString()} arrow>
              {ValueComponent}
            </Tooltip>
          ) : ValueComponent}
        </Box>
      </Box>
    </Grid>
  );
};

export const EventInfoText = ({ children }: any) => {
  return (
    <Typography variant="subtitle1" sx={{ mb: 1 }}>
      {children}
    </Typography>
  )
}

export default EventInfoGridItem;