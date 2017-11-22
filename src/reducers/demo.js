const initialState = {
  text: '',
};

export default function demo(state = initialState, action) {
  switch (action.type) {
    case 'DEMO_SHOW_TEXT':
      return {
        ...state,
        text: action.text,
      };
    default:
      return state;
  }
}
