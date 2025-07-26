export const getChileanSeason = date => {
  const month = date.getMonth()
  const day = date.getDate()

  if (
    (month === 11 && day >= 21) ||
    month === 0 ||
    month === 1 ||
    (month === 2 && day < 21)
  ) {
    return 1 // Diciembre 21 - Marzo 20
  } else if (
    (month === 2 && day >= 21) ||
    month === 3 ||
    month === 4 ||
    (month === 5 && day < 21)
  ) {
    return 2 // Marzo 21 - Junio 20
  } else if (
    (month === 5 && day >= 21) ||
    month === 6 ||
    month === 7 ||
    (month === 8 && day < 23)
  ) {
    return 3 // Junio 21 - Septiembre 22
  } else {
    return 4 // Septiembre 23 - Diciembre 20
  }
}
