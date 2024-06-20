export const reactSelectStyles = {
    control: (provided: any, state: { isFocused: any; }) => ({
      ...provided,
      minHeight: '25px',
      height: '25px',
      boxShadow: state.isFocused ? null : null,
    }),
    valueContainer: (provided: any, _state: any) => ({
      ...provided,
      height: '25px',
      padding: '0 6px'
    }),
    input: (provided: any, _state: any) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: (_state: any) => ({
      display: 'none',
    }),
    indicatorsContainer: (provided: any, _state: any) => ({
      ...provided,
      height: '25px',
    }),
};