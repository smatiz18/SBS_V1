import { createTheme } from "@mui/material/styles";

const dkDarkGray = '#242424';
const fdGray = '#455058';
const reactInputBorderColor = '#ccc'
const headerTextColor = '#333';

export const reactInputStyles = {
  width: '100%', 
  height: '40px',
  padding: '0 8px',
  borderRadius: '4px', 
  border: `1px solid ${reactInputBorderColor}`,
  fontSize: '16px',
  boxSizing: 'border-box',
}

export const selectSx = {
  fontFamily: 'IBM Plex Sans, sans-serif',
  width: '100%'
};

export const smallFontSelectSx = {
  fontFamily: 'IBM Plex Sans, sans-serif',
  width: '100%',
  fontSize: '.8rem'
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const filterAccordianSx = {
  fontSize: '.85rem',
  fontFamily: 'IBM Plex Sans, sans-serif',
  margin: 0,
  padding: 0,
  backgroundColor: dkDarkGray,
  '&.MuiAccordion-root': {
    boxShadow: 'none',
    border: `1px solid ${fdGray}`,
    borderRadius: '4px'
  },
  '& .MuiAccordionSummary-root': {
    padding: '4px 10px',
    minHeight: '34px',
    '&.Mui-expanded': {
      minHeight: '34px',
    },
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    '&.Mui-expanded': {
      margin: 0,
    },
  },
  '& .MuiAccordionDetails-root': {
    display: 'flex',
    justifyContent: 'center',
    padding: '6px 10px',
  },
};

export const subFilterAccordianSx = {
  fontSize: '.85rem',
  fontFamily: 'IBM Plex Sans, sans-serif',
  margin: 0,
  padding: 0,
  backgroundColor: dkDarkGray,
  '&.MuiAccordion-root': {
    boxShadow: 'none',
    border: `1px solid ${fdGray}`,
    borderRadius: '4px'
  },
  '& .MuiAccordionSummary-root': {
    padding: '4px 10px',
    minHeight: '34px',
    '&.Mui-expanded': {
      minHeight: '34px',
    },
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    '&.Mui-expanded': {
      margin: 0,
    },
  },
  '& .MuiAccordionDetails-root': {
    display: 'flex',
    justifyContent: 'center',
  }
};

export const radioIconSx = {
  '& .MuiSvgIcon-root': {
    fontSize: '.8rem',
  }
};

export const radioLabelSx = {
  '& .MuiTypography-root': {
    fontSize: '.8rem',
    fontFamily: 'IBM Plex Sans, sans-serif' 
  }
};

export const formLabelSx = {
  fontSize: '.8rem',
  fontFamily: 'IBM Plex Sans, sans-serif' 
};

export const paginationSx = {
  display: 'flex',
  justifyContent: 'center', 
  fontSize: '.8rem',
  fontFamily: 'IBM Plex Sans, sans-serif' 
};

export const accordianSummarySx = {
  margin: 0, 
  padding: 0, 
  backgroundColor: dkDarkGray,
  borderRadius: '4px'
};

export const quickStatsLineChartStyle = {
  fontSize: '.8rem',
  fontFamily: 'IBM Plex Sans, sans-serif' 
};

export const checkboxFormControlLabelSx = {
  '& .MuiFormControlLabel-label': {
    fontSize: '0.8rem', 
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
};

export const deleteIconSx = {
  fontSize: '1rem',
};

export const buttonStyleSx = {
  'fontSize': '.7rem',
  'textTransform': 'none'
};

export const loginButtonStyleSx = {
  'fontFamily': 'IBM Plex Sans, sans-serif',
  '&:hover': {
    'transform': 'translateY(-2px)',
  },
  'color': headerTextColor,
  'textTransform': 'none',
  'borderRadius': '4px', 
  'border': `1px solid ${reactInputBorderColor}`,
  'backgroundColor': "white",
  'width': '60%'
};