import * as Tone from 'tone';

class TrackManager
{

  constructor()
  {
    this.analyser = Tone.getContext().createAnalyser();
    // todo: tonejs may wrap these options under other names
    // it's possible I shouldn't use tone for this,
    // this.analyser.frequencyBinCount = 256;
    this.frequencyBuffer = new Uint8Array(this.analyser.frequencyBinCount);
    // this.analyser.fftSize = 256;
    // this.timeDomainBuffer = new Uint8Array(this.analyser.fftSize);
  }

  load = (audioContent) =>
  {
    return Tone.getContext().decodeAudioData(audioContent).then((decoded)=>{
      // fixme: this code/equivalent needs to be called somewhere
      // await Tone.start();
      this.buffer = decoded;
      if(this.player)
      {
        this.player.stop();
      }
      this.player = new Tone.Player(decoded).toDestination().sync();
      this.player.connect(this.analyser);
      this.player.start();
      return this;
    })
  }

  play = () =>
  {
    if(!this.player){ return; }
    Tone.Transport.start();
  }

  getFrequencyData = () =>
  {
    this.analyser.getByteFrequencyData(this.frequencyBuffer);
    return this.frequencyBuffer;
  }

  getTimeData = () =>
  {
    this.analyser.getTimeDomainData(this.frequencyBuffer);
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
