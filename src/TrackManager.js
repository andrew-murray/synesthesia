import * as Tone from 'tone';

class TrackManager
{
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
      this.player.start();
      return this;
    })
  }

  play = () =>
  {
    if(!this.player){ return; }
    Tone.Transport.start();
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
