import * as Tone from 'tone';

class TrackManager
{
  load = (audioContent) =>
  {
    return Tone.getContext().decodeAudioData(audioContent).then((decoded)=>{
      this.buffer = decoded;
      if(this.player)
      {
        this.player.stop();
      }
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
};

export default TrackManager;