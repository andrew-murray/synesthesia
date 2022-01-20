import React from 'react';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Fab from '@mui/material/Fab';

function PlaybackControls(props)
{
  return (
    <Fab variant="extended"
      disableRipple
    >
      <ButtonGroup>
        <IconButton
          onClick={props.onPrev ? props.onPrev : undefined}
          disabled={props.onPrev === undefined}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton
          onClick={props.onNext ? props.onNext : undefined}
          disabled={props.onNext === undefined}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </ButtonGroup>
    </Fab>
   );
};

export default PlaybackControls;
