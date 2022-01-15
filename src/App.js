// import logo from './logo.svg';
import './App.css';
import TitleScreen from "./TitleScreen";
import React from "react";
import TrackManager from "./TrackManager";
import AudioScreen from "./AudioScreen";

// http://www.openmusicarchive.org/ could be used for example music


class App extends React.Component
{
  state = {
    active: false
  }

  constructor(props)
  {
    super(props)
    this.trackManager = new TrackManager();
  }

  render()
  {

    const setFileContent = (content) =>
    {

      this.trackManager.load(content)
        .then(manager=>{ manager.play(); })
        .then( ()=>{this.setState( { active: true } );} )
    };

    return (
      <div className="App">
        { this.state.active === false &&
          <header className="App-header">
              <TitleScreen
                onOpen={(fileState)=>{
                  setFileContent(fileState.content);
                }}
              />
          </header>
        }
        { this.state.active === true &&
          <header className="App-header">
            <AudioScreen
              trackManager={this.trackManager}
            />
          </header>
        }
      </div>
    );
  }

}

export default App;
