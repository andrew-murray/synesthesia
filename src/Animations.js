import * as mathjs from "mathjs";
import NoteGetter from "./NoteGetter";
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

function notePlot(props)
{
  if(props.ctx)
  {
    const noteGetter = new NoteGetter(props.trackManager);
    const noteFreqs = noteGetter.getNoteFrequencies(180);
    const bufferLength = noteFreqs.length;

    props.ctx.fillStyle = 'rgb(0, 0, 0)';
    props.ctx.fillRect(0, 0, props.width, props.height);
    //Draw spectrum

    // todo: this is very hacky, let's not worry that it's a copy-paste of the normal bar-chart

    const atomsPerGap = 1;
    // we assume we're plotting even octaves of Cs
    const octaves = Math.ceil(bufferLength / 12);
    const bufferLengthOctaves = octaves * 12;

    // we only need to allocate space for the white notes really
    const whiteNotesPerOctave = 7;
    const atomsPerWhiteNote = 8;
    // we need one extra c on the end, to make our drawing work
    const totalAtoms = octaves * whiteNotesPerOctave * (atomsPerGap + atomsPerWhiteNote) + atomsPerWhiteNote;
    const pixelsPerAtom = props.width / totalAtoms;
    // note: this has to be smaller than atomsPerWhiteNote to not break our structure
    const blackNoteWidthAtoms = atomsPerWhiteNote * 0.75;
    const blackNoteActiveWidthAtoms = blackNoteWidthAtoms * 0.75;
    // one loop for whitenotes, one for black so we don't have to manage complex shapes

    const whiteNoteIndexLookup = [
      0, // c
      0, // c#
      1, // d
      1, // d#
      2, // e
      3, // f
      3, // f#
      4, // g
      4, // g#
      5, // a
      5, // a#
      6, // b
    ];

    // note we could do this better, by thinking in terms of each white note in an octave instead
    // bute then we might have to do awkward things for the lookup
    for(let i  = 0; i < bufferLengthOctaves; ++i)
    {
      const mod12 = ( i % 12 );
      const blackNote = ( mod12 === 1 ) // C#
        || (mod12 === 3) // D#
        || (mod12 === 6) // F#
        || (mod12 === 8) // G#
        || (mod12 === 10); // A#
      if(blackNote)
      {
        // todo;
        continue;
      }
      const octaveIndex = Math.floor(i / 12);
      const whiteNoteIndex = (octaveIndex * whiteNotesPerOctave) + whiteNoteIndexLookup[ mod12 ];
      const posX = whiteNoteIndex * ( atomsPerWhiteNote + atomsPerGap ) * pixelsPerAtom;
      const posY = 0;

      const active = (i < bufferLength) && noteFreqs[i] === 1;
      if(active)
      {
        props.ctx.fillStyle = 'rgb(230, 120, 0)';
      }
      else
      {
        props.ctx.fillStyle = 'rgb(255,255,255)';
      }
      props.ctx.fillRect(posX, posY, pixelsPerAtom * atomsPerWhiteNote, props.height);
    }

    // blackNote loop
    for(let i  = 0; i < bufferLengthOctaves; ++i)
    {
      const mod12 = ( i % 12 );
      const blackNote = ( mod12 === 1 ) // C#
        || (mod12 === 3) // D#
        || (mod12 === 6) // F#
        || (mod12 === 8) // G#
        || (mod12 === 10); // A#
      if(!blackNote)
      {
        continue;
      }
      const octaveIndex = Math.floor(i / 12);
      const prevWhiteNoteIndex = (octaveIndex * whiteNotesPerOctave) + whiteNoteIndexLookup[ mod12 ];
      const blackNoteCenterPixel = pixelsPerAtom * ( prevWhiteNoteIndex * (atomsPerWhiteNote + atomsPerGap) + (atomsPerWhiteNote) + atomsPerGap/2.0);
      const blackNoteWidth = blackNoteWidthAtoms * pixelsPerAtom;
      const blackNoteHeight = props.height * 0.75;
      {
        const posX = blackNoteCenterPixel - (blackNoteWidth/2);
        props.ctx.fillStyle = 'rgb(0, 0, 0)';
        props.ctx.fillRect(posX, 0, blackNoteWidth,  blackNoteHeight);
      }

      const active = (i < bufferLength) && noteFreqs[i] === 1;
      // let's fill the inactive portion regardless

      if(active)
      {
        props.ctx.fillStyle = 'rgb(230, 120, 0)';
        const activeWidthPixels = blackNoteActiveWidthAtoms * pixelsPerAtom;
        const posX = blackNoteCenterPixel - (activeWidthPixels / 2)
        const outlineWidth = (blackNoteWidth - activeWidthPixels) / 2;
        props.ctx.fillRect(posX, 0, activeWidthPixels,  blackNoteHeight - outlineWidth);
      }
    }
  }
}

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

const Animations = [
  { name: "BARS", func: plotter, settings: { }},
  { name: "RADIAL", func: speakerPlotter, settings: { }},
  { name: "NOTES", func: notePlot, settings: {}}
];

export default Animations;