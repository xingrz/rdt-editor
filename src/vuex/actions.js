export const sync = ({ dispatch }, source) => {
  dispatch('SYNC', source)
}

export const scroll = ({ dispatch }, scroll) => {
  dispatch('SCROLL', scroll)
}

export const select = ({ dispatch }, start, end) => {
  dispatch('SELECT' , { start, end })
}
