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

function AudioScreen(props) {
  const canvasRef = useRef();
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
  }, []);

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
