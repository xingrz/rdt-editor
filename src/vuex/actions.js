export const sync = ({ dispatch }, from, source) => {
  dispatch('SYNC', { from, source })
}

export const select = ({ dispatch }, from, start, end) => {
  dispatch('SELECT' , { from, start, end })
}
