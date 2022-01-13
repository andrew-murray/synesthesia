import React from 'react'
import FileImport from "./FileImport";
import Button from '@mui/material/Button';
import TitledDialog from "./TitledDialog"
import './App.css';

class TitleScreen extends React.Component
{
  state = {
    error: this.props.error
  }

  render()
  {
    // if a load of a song is in flight don't show file open buttons
    const handleFileImport = (e) =>
    {
      this.props.onOpen({content: e.content, name: e.file})
    };

    const controls = (
      <React.Fragment>
        <FileImport
          variant="contained"
          onImport={handleFileImport}
          accept=".mp3"
          />
      </React.Fragment>
    );
    const { classes } = this.props;
    return (
      <div className="App">
        <div>
          {controls}
        </div>
        { !!this.state.error &&
          <TitledDialog
            title="Something went wrong."
            open={!!this.state.error}
            onClose={()=>{this.setState({error: null})}}
          >
            {this.state.error}
          </TitledDialog>
        }
      </div>
    );
  }
};

export default TitleScreen;
