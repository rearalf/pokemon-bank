export const today = () => new Date().toLocaleString('es-ES')

export const fmt = (n) => '$' + Number(n).toFixed(2);