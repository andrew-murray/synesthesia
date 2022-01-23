import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import TrackManager from "./TrackManager";
import NavControls from "./NavControls";
import Animations from "./Animations";
import SettingsAccordion from "./SettingsAccordion";
import Fade from "@mui/material/Fade";

const animate = (ctx, width, height, trackManager, animationIndex) =>
{
  const animator = Animations[animationIndex];
  if(animator !== undefined)
  {
    animator.func({ctx, width, height, trackManager});
  }
  else
  {
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, width, height);
  }
}

function AudioScreen(props) {
  const canvasRef = useRef();
  const [ctx, setCtx] = useState(null);
  const [animationMode, setAnimationMode] = useState(0);
  const [hovered, setHovered] = useState(false);

  const fadeDuration = 500;
  const inactivityTimeout = 1000;

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
  }, []);


  let activeTimeout = null;
  useEffect(()=>{
    return ()=>{
      clearTimeout(activeTimeout);
    }
  });

  // set to stop spam in debug
  const limitAnimate = null;
  let animateCount = 0;

  useEffect(()=>{
    const interval = setInterval(
      ()=> {
        if( limitAnimate !== null )
        {
          if(animateCount >= limitAnimate )
          {
            return;
          }
          animateCount++;
        }
        if(ctx)
        {
          animate(ctx, props.width, props.height, props.trackManager, animationMode);
        }
      },
      Math.floor(1000/20.0) // 20 fps in ms
    )
    return ()=>{
      clearInterval(interval);
    };
  });

  const onNextVis = (event) =>
  {
    const nextMode = Math.min( animationMode + 1, Animations.length - 1 );
    setAnimationMode( nextMode );
  };

  const onPrevVis = (event) =>
  {
    const nextMode = Math.max( animationMode - 1, 0 );
    setAnimationMode( nextMode );
  };

  const createTimeout = () => {
    activeTimeout = setTimeout(
      ()=>{
        setHovered(false);
      },
      inactivityTimeout
    );
  };

  const onMouseHover = (event) =>
  {
    setHovered(
      true
    );
    clearTimeout(activeTimeout);
    createTimeout();
  };

  const onMouseEnter = (event) => {
    clearTimeout(activeTimeout);
  };

  const onMouseLeave = (event) => {
    clearTimeout(activeTimeout);
    createTimeout();
  };

  // TODO: Think about pages.mtu.edu/~suits/notefreqs.html
  // and tune our frequencyData to get more sensible frequencies out? rather than it just being tuned to the mechanics of speakers
  // note that hz ~ note is nonlinear (c#0 - c0 ~= 1hz, b8 - a#8 ~= 450hz)


  return (
    <div>
      <canvas
        width={props.width} height={props.height} ref={canvasRef}
        onClick={props.trackManager.pauseUnpause}
        onMouseMove={onMouseHover}
      />
      <Fade in={hovered} timeout={fadeDuration}>
        <div style={{position: "fixed", bottom: "1em", right: "1em"}}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavControls
            onPrev={ animationMode !== 0 ? onPrevVis : undefined}
            onNext={ animationMode !== Animations.length - 1 ? onNextVis : undefined}
          />
        </div>
      </Fade>
      <Fade in={hovered} timeout={fadeDuration}>
        <div style={{position: "fixed", top: "1em", right: "1em", width: "15em"}}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <SettingsAccordion
            trackManager={props.trackManager}
          />
        </div>
      </Fade>
    </div>
  );
}

AudioScreen.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  trackManager: PropTypes.instanceOf(TrackManager).isRequired
};

export default AudioScreen;
