import React from 'react'
import TitledDialog from "./TitledDialog"
import FileDropzone from "./FileDropzone";
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
      <FileDropzone
        onImport={handleFileImport}
        accept=".mp3"
      />
    );
    return (
      <React.Fragment>
        {controls}
        { !!this.state.error &&
          <TitledDialog
            title="Something went wrong."
            open={!!this.state.error}
            onClose={()=>{this.setState({error: null})}}
          >
            {this.state.error}
          </TitledDialog>
        }
      </React.Fragment>
    );
  }
};

export default TitleScreen;
