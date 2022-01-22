import * as Tone from 'tone';

let toneInitialised = false;

const ensureToneInitialised = async () => {
  if(toneInitialised)
  {
    return Promise.resolve();
  }
  else
  {
    return Tone.start().then( () =>{ toneInitialised = true; } );
  }
};

class TrackManager
{

  constructor()
  {
    ensureToneInitialised();
  }

  configureAnalysers = (resolution) =>
  {
    if(!this.analyser || this.analyser.fftSize !== resolution)
    {
      this.analyser = Tone.getContext().createAnalyser();
      this.player.connect(this.analyser);
      this.analyser.fftSize = resolution;
      this.frequencyBuffer = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeDomainBuffer = new Uint8Array(this.analyser.fftSize);
    }
  }

  load = (audioContent) =>
  {
    return ensureToneInitialised().then( () => { return Tone.getContext().decodeAudioData(audioContent).then((decoded)=>{
      // fixme: this code/equivalent needs to be called somewhere
      // await Tone.start();
      this.buffer = decoded;
      if(this.player)
      {
        this.player.stop();
      }
      this.player = new Tone.Player(decoded).toDestination().sync();
      this.player.start();
      return this;
    })});
  }

  play = () =>
  {
    if(!this.player){ return; }
    Tone.Transport.start();
  }

  getFrequencyData = (size) =>
  {
    this.configureAnalysers(size);
    this.analyser.getByteFrequencyData(this.frequencyBuffer);
    return this.frequencyBuffer;
  }

  getTimeData = (size) =>
  {
    this.configureAnalysers(size);
    this.analyser.getTimeDomainData(this.timeDomainBuffer);
    return this.timeDomainBuffer;
  }

  pause = () =>
  {
    if(!this.player){ return; }
    Tone.Transport.pause();
  }

  stop = () =>
  {
    if(!this.player){ return; }
    Tone.Transport.stop();
  }

  getState = () => {
    return Tone.Transport.state;
  }

  toggle = () => {
    if(!this.player){ return; }
    Tone.Transport.toggle();
  }

  pauseUnpause = () => {
    if(this.getState() === "started")
    {
      this.pause();
    }
    else
    {
      this.play();
    }
  }
};

export default TrackManager;
