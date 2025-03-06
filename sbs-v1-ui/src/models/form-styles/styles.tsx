import { createTheme } from "@mui/material/styles";

const dkDarkGray = '#242424';
const fdGray = '#455058';
const reactInputBorderColor = '#ccc'
const headerTextColor = '#333';
const toggleBackgroundColor = 'rgba(0, 0, 0, 0.05)';
const toggleBackgroundColorHover = 'rgba(0, 0, 0, 0.1)';
const sbsPurpleBlueMain = '#0342FF'; 
const darkenSbsPurpleBlueMain = `#0342DE`;
const sbsFont = 'IBM Plex Sans, sans-serif';

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
  fontFamily: sbsFont,
  width: '100%',
  "&.MuiSelect-icon": {
    fontSize: ".35rem",
    right: "2px"
  }
};

export const smallFontSelectSx = {
  fontFamily: sbsFont,
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
  fontFamily: sbsFont,
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
  fontFamily: sbsFont,
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
    fontFamily: sbsFont 
  }
};

export const formLabelSx = {
  fontSize: '.8rem',
  fontFamily: sbsFont 
};

export const paginationSx = {
  display: 'flex',
  justifyContent: 'center', 
  fontSize: '.7rem',
  fontFamily: sbsFont,
  "& .MuiPaginationItem-icon": {
    fontSize: ".8rem",
  },
  "& .MuiPaginationItem-root": {
    minWidth: "15px",
    height: "25px",
    padding: "5px",
    fontSize: ".8rem"
  }
};

export const accordianSummarySx = {
  margin: 0, 
  padding: 0, 
  backgroundColor: dkDarkGray,
  borderRadius: '4px'
};

export const quickStatsLineChartStyle = {
  fontSize: '.8rem',
  fontFamily: sbsFont 
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
  'fontFamily': sbsFont,
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

export const toggleGroupSx = {
  borderRadius: 2,
  overflow: 'hidden',
  backgroundColor: toggleBackgroundColor,
  fontFamily: sbsFont,
  backdropFilter: 'blur(6px)',
  '& .MuiToggleButton-root': {
    fontSize: '0.75rem',
    padding: '4px 12px',
    minWidth: 'auto', 
    borderRadius: 1.5,
    border: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: toggleBackgroundColorHover,
    },
    '&.Mui-selected': {
      backgroundColor: sbsPurpleBlueMain,
      color: 'white',
      fontWeight: '600',
      '&:hover': {
        backgroundColor: darkenSbsPurpleBlueMain,
      },
    },
  },
};

export const toggleButtonSx = {
  textTransform: 'none'
};