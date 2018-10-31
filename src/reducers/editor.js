const initialState = {
  text: '',
};

export default function editor(state = initialState, action) {
  switch (action.type) {
    case 'EDITOR_SAVE':
      return {
        ...state,
        text: action.text,
      };
    default:
      return state;
  }
}
