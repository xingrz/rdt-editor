export const sync = ({ dispatch }, source) => {
    dispatch('SYNC', source)
}

export const select = ({ dispatch }, start, end) => {
    dispatch('SELECT' , { start, end })
}
