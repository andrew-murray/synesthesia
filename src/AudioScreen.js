import React, { useEffect, createContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import TrackManager from "./TrackManager";
import NavControls from "./NavControls";
import * as mathjs from "mathjs";

export const CanvasContext = createContext();

function plotter(props)
{
  if(props.ctx)
  {
    const frequencyBytes = props.trackManager.getFrequencyData(256);
    const bufferLength = frequencyBytes.length

    props.ctx.fillStyle = 'rgb(0, 0, 0)';
    props.ctx.fillRect(0, 0, props.width, props.height);
    //Draw spectrum

    // hold back one pixel for the right-hand-side of the window
    // construct the following

    // todo: not covering the area looks really bad

    /*
    black margin before each bar
    BrrrrBrrrrBrrrrBrrrrB
    BrrrrBrrrrBrrrrBrrrrB
    BrrrrBrrrrBrrrrBrrrrB
    BrrrrBrrrrBrrrrBrrrrB
    BrrrrBrrrrBrrrrBrrrrB
    */

    const blackLineMargin = 1;
    const pixelsPerBar = Math.floor( (props.width-blackLineMargin) / bufferLength );
    const barWidth = pixelsPerBar - blackLineMargin;

    for (let i = 0; i < bufferLength; i++) {
      // const barHeight = (frequencyBytes[i] + 140) * 2;
      const barHeight = Math.floor( (frequencyBytes[i] / 256.0) * props.height);
      // const barHeight = Math.floor( 1.0 * props.height);
      const colorScalar = (frequencyBytes[i] / 255.0)  + 0.25;
      const redMin = 50;
      const redScalar = Math.min( Math.floor(redMin + colorScalar * (255 - redMin)), 255);

      const posX = (pixelsPerBar * i) + blackLineMargin;
      props.ctx.fillStyle = 'rgb(' + redScalar + ', 50, 50)';
      const posY = props.height - barHeight;
      props.ctx.fillRect(posX, posY, barWidth, barHeight);
    }
  }
}

function fmtColor(v)
{
  const val = "rgb(" + v[0].toString() + "," + v[1].toString() + ","+ v[2].toString() + ")";
  return val;
}

const blend = (a,b,weight) =>
{
  return mathjs.add(
    mathjs.multiply(a, 1 - weight),
    mathjs.multiply(b, weight)
  );
}

function speakerPlotter(props)
{
  if(props.ctx)
  {
    let ctx = props.ctx;
    const frequencyBytes = props.trackManager.getFrequencyData(128);
    const bufferLength = frequencyBytes.length

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, props.width, props.height);

    // let's assume that these audio bins aren't typically going to be well-filled
    const averageMagnitude = frequencyBytes.reduce( (total, incomingByte) => total + incomingByte, 0.0) / frequencyBytes.length;
    const speakerMin = [51,51,51];
    const speakerMax = [180,180,180]; // [230,230,230];
    // create a [0,1] number but boost it, since we expect the average to be quite small a lot of the time
    const speakerScale = Math.min( (averageMagnitude / 255.0) * 2.5, 1.0 );
    const speakerColorVector = blend(
      speakerMin,
      speakerMax,
      1.0 - speakerScale
    );

    // draw "speaker"
    // todo: refine how this looks, somewhat silly right now
    const centerPixel = [props.width/2.0, props.height/2.0];
    const isoSize = Math.min(props.width, props.height);
    const circleRadius = isoSize/5.0;
    const innerRadius = circleRadius / 6.0;
    const outerRadius = circleRadius;
    let gradient = ctx.createRadialGradient(centerPixel[0], centerPixel[1], innerRadius, centerPixel[0], centerPixel[1], outerRadius);
    gradient.addColorStop(0, fmtColor(speakerMin));
    gradient.addColorStop(1, fmtColor(speakerColorVector));
    ctx.fillStyle = gradient;
    ctx.arc( centerPixel[0], centerPixel[1], circleRadius, 0, 2 * Math.PI );
    ctx.fill();

    // draw buffers roughly thrice as wide as the gaps between them
    // note that in a circular buffer, we have "n" gaps (not n-1 or n+1!)
    // todo: refactor this code to refer to variables
    const symmetries = 6;
    const symAngle = 2 * Math.PI / symmetries;

    const bufferAndGapAngle = (symAngle/ bufferLength);
    const bufferAngle = (symAngle/ bufferLength) * (3/4);
    // const gapAngle = (symAngle / bufferLength) * (1/4);
    // let's start at a random offset so as not to be too symmetrical
    // we probably really want to be kaleidoscopic and plot the bars all around the circle
    const globalAngleOffset = (2 * Math.PI) / 73;

    for (let i = 0; i < bufferLength; i++)
    {
      const startAngle = globalAngleOffset + (bufferAndGapAngle * i);
      const endAngle = startAngle + bufferAngle;
      const frequencyScalar = (frequencyBytes[i] / 255);
      // const barHeight = Math.floor( 1.0 * props.height);
      const colorScalar = Math.min( (frequencyScalar) + 0.25, 1.0 );
      const colorMin = [128, 179, 255];
      const colorMax = [255, 153, 102];
      const colorForBar = blend( colorMin, colorMax, colorScalar );
      const maxBarHeight = circleRadius * 1.5;
      ctx.fillStyle = fmtColor(colorForBar);
      for(let sym = 0; sym < symmetries; ++sym)
      {
        const localStartAngle = (symAngle * sym) + startAngle;
        const localEndAngle = (symAngle * sym) + endAngle;
        ctx.beginPath();
        ctx.arc(centerPixel[0], centerPixel[1], circleRadius + ( maxBarHeight * frequencyScalar), localStartAngle, localEndAngle, false) // outer (filled)
        ctx.arc(centerPixel[0], centerPixel[1], circleRadius, localEndAngle, localStartAngle, true); // inner (unfills it)
        ctx.fill();
      }
    }
  }
}


const AnimationModes = [
  "BARS",
  "RADIAL"
];

const animate = (ctx, width, height, trackManager, mode) =>
{
  if( mode === AnimationModes[0] )
  {
    plotter({ctx: ctx, width: width, height: height, trackManager: trackManager});
  }
  else if( mode === AnimationModes[1])
  {
    speakerPlotter({ctx: ctx, width: width, height: height, trackManager: trackManager});
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

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
  }, []);

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
          animate(ctx, props.width, props.height, props.trackManager, AnimationModes[animationMode]);
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
    const nextMode = Math.min( animationMode + 1, AnimationModes.length - 1 );
    setAnimationMode( nextMode );
  };

  const onPrevVis = (event) =>
  {
    const nextMode = Math.max( animationMode - 1, 0 );
    setAnimationMode( nextMode );
  };

  return (
    <CanvasContext.Provider value={{ ctx }}>
      <div>
        <canvas
          width={props.width} height={props.height} ref={canvasRef}
          onClick={props.trackManager.pauseUnpause}
        />
        <div style={{position: "fixed", bottom: "1em", right: "1em"}}>
          <NavControls
            onPrev={ animationMode !== 0 ? onPrevVis : undefined}
            onNext={ animationMode !== AnimationModes.length - 1 ? onNextVis : undefined}
          />
        </div>
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
