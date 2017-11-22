const initialState = {
};

export default function icons(state = initialState, action) {
  switch (action.type) {
    case 'ICON_FETCHING':
    case 'ICON_FAILED':
      return {
        ...state,
        [action.icon]: null,
      };
    case 'ICON_FETCHED':
      return {
        ...state,
        [action.icon]: action.content,
      };
    default:
      return state;
  }
}
