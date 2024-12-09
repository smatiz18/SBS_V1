import { createTheme } from "@mui/material/styles";

export const reactInputStyles = {
  width: '100%', // Match width of the select component
  height: '40px', // Same height as React Select
  padding: '0 8px', // Same padding as the select input
  borderRadius: '4px', // Same border radius
  border: '1px solid #ccc', // Same border style and color
  fontSize: '16px', // Same font size
  boxSizing: 'border-box', // Ensures padding is included in the height/width
}

export const selectSx = {
  fontFamily: 'IBM Plex Sans, sans-serif',
  width: '100%'
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
  backgroundColor: '#242424',
  '&.MuiAccordion-root': {
    boxShadow: 'none',
    borderBottom: '1px solid #ccc',
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
    padding: '6px 10px',
  },
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
    backgroundColor: 'rgb(#455058, .5)',
    border: '1px solid #242424', 
    borderRadius: '4px'
  }