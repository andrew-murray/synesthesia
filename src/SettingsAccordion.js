import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SliderWithInput from "./SliderWithInput";

function SettingsAccordion(props) {
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
        default={-80}
        onChange={()=>{}}
      />
      <SliderWithInput
        name="MaxDb"
        min={-50}
        max={0}
        default={-20}
        onChange={()=>{}}
      />
      <SliderWithInput
        name="Smoothing"
        min={0}
        max={1.0}
        step={0.1}
        default={0.8}
        onChange={()=>{}}
      />
      <SliderWithInput
        name="Size"
        min={64}
        max={512}
        default={256}
        onChange={()=>{}}
      />
    </AccordionDetails>
  </Accordion>
  );
}

export default SettingsAccordion;