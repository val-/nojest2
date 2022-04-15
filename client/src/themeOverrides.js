import themePalette from './themePalette';

const overrides = {
  MuiCardHeader: {
    action: {
      marginTop: 0,
      marginRight: 0,
    }
  },
  MuiButton: {
    containedPrimary: {
      backgroundColor: themePalette.primary.light,
    },
    label: {
      fontWeight: 'bold',
    }
  },
};

export default overrides;
