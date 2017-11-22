import md5 from 'md5';

const baseUrl = 'https://upload.wikimedia.org/wikipedia/commons';

export function get(icon) {
  return async (dispatch, getState) => {
    const { icons } = getState();
    if (typeof icons[icon] != 'undefined') {
      return;
    }

    dispatch({ type: 'ICON_FETCHING', icon });

    try {
      const file = `BSicon_${icon}.svg`;
      const hash = md5(file);

      const res = await fetch(`${baseUrl}/${hash.substring(0, 1)}/${hash.substring(0, 2)}/${file}`);
      if (res.status >= 200 && res.status < 300) {
        const svg = await res.text();
        const content = `data:image/svg+xml;base64,${btoa(svg)}`;
        dispatch({ type: 'ICON_FETCHED', icon, content });
      } else {
        dispatch({ type: 'ICON_FAILED', icon });
      }
    } catch (e) {
      console.error(e.stack);
      dispatch({ type: 'ICON_FAILED', icon });
    }
  };
}
