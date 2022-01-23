import React from 'react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

/*
  This is ripped from https://mui.com/components/slider/ and generalised a little.
*/

export default function InputSlider(props) {
  const [value, setValue] = React.useState(props.default);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < props.min) {
      setValue(props.min);
    } else if (value > props.max) {
      setValue(props.max);
    }
  };

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={3}>
        <InputLabel>
          {props.name}
        </InputLabel>
      </Grid>
      <Grid item xs={4}>
        <Slider
          value={typeof value === 'number' ? value : 0}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          min={props.min}
          max={props.max}
          step={props.step ? props.step : (props.max - props.min)/100}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          value={value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            // step: 10,
            min: props.min,
            max: props.max,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        />
      </Grid>
    </Grid>
  );
}

InputSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  default: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}