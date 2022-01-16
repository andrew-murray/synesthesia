import React, { useContext, useEffect, createContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import TrackManager from "./TrackManager";

export const CanvasContext = createContext();

function Rectangle({ color, coordinates }) {
  const { ctx } = useContext(CanvasContext);
  const { x, y, width, height } = coordinates;

  useEffect(() => {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    }
  }, [x, y, width, height, ctx, color]);
  return null;
}

function plotter(props)
{
  if(props.ctx)
  {
    const frequencyBytes = props.trackManager.getFrequencyData();
    const bufferLength = frequencyBytes.length

    props.ctx.fillStyle = 'rgb(0, 0, 0)';
    props.ctx.fillRect(0, 0, props.width, props.height);
    //Draw spectrum
    const barWidth = (props.width / bufferLength);
    for (let i = 0; i < bufferLength; i++) {
      // const barHeight = (frequencyBytes[i] + 140) * 2;
      const barHeight = Math.floor( (frequencyBytes[i] / 255.0) * props.height);
      const colorScalar = (frequencyBytes[i] / 255.0)  + 0.25;
      const redMin = 50;
      const redScalar = Math.min( Math.floor(redMin + colorScalar * (255 - redMin)), 255);
      const posX = barWidth * i;
      props.ctx.fillStyle = 'rgb(' + redScalar + ', 50, 50)';
      const posY = props.height - barHeight;
      props.ctx.fillRect(posX, posY, barWidth, barHeight);
    }
  }
}

function AudioScreen(props) {
  const canvasRef = useRef();
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
  }, []);

  // onClick={()=>{plotter({ctx : ctx, trackManager: props.trackManager, width: props.width, height: props.height});}}
  return (
    <CanvasContext.Provider value={{ ctx }}>
      <div
        onClick={props.trackManager.pauseUnpause}
      >
        <canvas width={props.width} height={props.height} ref={canvasRef}></canvas>
        <Rectangle
          color="red"
          coordinates={{ x: props.width * 0.25, y: props.height * 0.25, width: props.width*0.5, height: props.height * 0.5}}
        />
      </div>
    </CanvasContext.Provider>
  );
}

AudioScreen.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  trackManager: PropTypes.instanceOf(TrackManager).isRequired
};

export default AudioScreen;
