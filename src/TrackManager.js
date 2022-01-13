import * as Tone from 'tone';

class TrackManager
{
  load = (audioContent) =>
  {
    return Tone.getContext().decodeAudioData(audioContent).then((decoded)=>{
      this.buffer = decoded;
      this.player = new Tone.Player(decoded).toDestination();
      return this;
    })
  }

  play = () =>
  {
    if(!this.player){ return; }
    this.player.start();
  }

  pause = () =>
  {
    if(!this.player){ return; }
    this.player.stop();
  }

  stop = () =>
  {
    if(!this.player){ return; }
    this.player.stop();
    this.player.seek(0);
  }

};

export default TrackManager;