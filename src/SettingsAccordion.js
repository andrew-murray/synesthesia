import PropTypes from 'prop-types';
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
        name="test"
        min={10}
        max={50}
        default={20}
        onChange={()=>{}}
      />
    </AccordionDetails>
  </Accordion>
  );
}

export default SettingsAccordion;