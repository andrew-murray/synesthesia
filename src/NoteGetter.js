import NotesDB from "./Notes.json"

export default class NoteGetter
{
  constructor(trackManager){
    this.track = trackManager;
  }

  getNoteFrequencies(ampThreshold)
  {
    // for now, rather than doing anything super smart
    // we seem to be able to cover "most" notes by just doing a 4096 bins
    // (for a 48000 sample rate audiocontext)
    // but the bottom end of the frequencies will have some errors
    const bins = 4096;
    const fullArray = this.track.getFrequencyData( bins * 2 );
    // note, this uint8array is initialised to zero
    let noteArray = new Uint8Array( NotesDB.length );
    let activeNoteIndex = 0;
    let activeNote = NotesDB[0];
    for(let index = 0; index < fullArray.length; ++index)
    {
      // todo: get sample-rate
      const sampleRate = 48000;
      const middleFrequency = (index + 0.5) * ( sampleRate / fullArray.length );

      // at the moment, we only count it if a single entry in our mega frequency table
      // is greater than the ampThreshold. Maybe we want something cumulative?
      if(fullArray[index] < ampThreshold)
      {
        continue;
      }
      // move our bin up, if we need to
      while(middleFrequency > activeNote.frequency_high && activeNoteIndex != NotesDB.length - 1  )
      {
        activeNoteIndex++;
        activeNote = NotesDB[activeNoteIndex];
      }

      if(fullArray[index] >= ampThreshold)
      {
        noteArray[activeNoteIndex] = 1;
      }
    }
    return noteArray;
  }
};