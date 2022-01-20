import React from 'react';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Fab from '@mui/material/Fab';

function NavControls(props)
{
  // todo: I can't do this
  // "button can't appear as a descendent of button"
  // this could be related to my event misfires, but unlikely
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

export default NavControls;
