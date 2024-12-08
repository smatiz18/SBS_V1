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
    borderBottom: '1px solid #ccc', // Optional: Add a subtle separator
  },
  '& .MuiAccordionSummary-root': {
    padding: '4px 10px', // Slightly increased padding for top and sides
    minHeight: '34px', // Adjusted for slightly larger height
    '&.Mui-expanded': {
      minHeight: '34px', // Maintain consistent height on expand
    },
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    '&.Mui-expanded': {
      margin: 0, // Ensure no extra margin when expanded
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: '6px 10px', // Slightly increased padding for details
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