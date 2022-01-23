import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SliderWithInput from "./SliderWithInput";

function SettingsAccordion(props) {
  /*
    Currently each animation can dictate its own size, so this one needs more thought
      <SliderWithInput
        name="Size"
        min={64}
        max={512}
        default={256}
        onChange={()=>{}}
      />
  */
  return (<Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography>Settings</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <SliderWithInput
        name="MinDb"
        min={-100}
        max={-50}
        default={props.trackManager.analyser.minDecibels}
        onChange={(value)=>{props.trackManager.analyser.minDecibels = value;}}
      />
      <SliderWithInput
        name="MaxDb"
        min={-50}
        max={0}
        default={props.trackManager.analyser.maxDecibels}
        onChange={(value)=>{props.trackManager.analyser.maxDecibels = value;}}
      />
      <SliderWithInput
        name="Smoothing"
        min={0}
        max={0.9}
        step={0.1}
        default={props.trackManager.analyser.smoothingTimeConstant}
        onChange={(value)=>{props.trackManager.analyser.smoothingTimeConstant = value;}}
      />
    </AccordionDetails>
  </Accordion>
  );
}

export default SettingsAccordion;