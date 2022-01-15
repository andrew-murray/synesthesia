// import logo from './logo.svg';
import './App.css';
import TitleScreen from "./TitleScreen";
import React from "react";
import TrackManager from "./TrackManager";
import AudioScreen from "./AudioScreen";

// http://www.openmusicarchive.org/ could be used for example music


// TODO: Add https://www.npmjs.com/package/react-dropzone

class App extends React.Component
{
  state = {
    active: false,
    width: 0,
    height: 0
  }

  constructor(props)
  {
    super(props)
    this.trackManager = new TrackManager();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render()
  {

    const setFileContent = (content) =>
    {

      this.trackManager.load(content)
        .then(manager=>{ manager.play(); })
        .then( ()=>{this.setState( { active: true } );} )
    };

    // arbitrary offset to ensure we don't create a pointless scroll bar
    // todo: just disable the scroll bar explicitly and render pixel-perfect
    const modifiedHeight = this.state.height - 1;

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
        { this.state.active === true && this.state.width !== 0 && this.state.height !== 0 &&
          <header className="App-header">
            <AudioScreen
              trackManager={this.trackManager}
              width={this.state.width}
              height={modifiedHeight}
            />
          </header>
        }
      </div>
    );
  }

}

export default App;
