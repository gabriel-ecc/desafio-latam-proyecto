export const URLBASE = 'http://localhost:3000'
export const apiVersion = '/api/v1'

export const ENDPOINT = {
  users: `${URLBASE}${apiVersion}/users`,
  employees: `${URLBASE}${apiVersion}/users/employee`,
  products: `${URLBASE}${apiVersion}/products`,
  productsFrontPage: `${URLBASE}${apiVersion}/products/frontPage`,
  inventory: `${URLBASE}${apiVersion}/products/inventory`,
  seasons: `${URLBASE}${apiVersion}/seasons`,
  categories: `${URLBASE}${apiVersion}/categories`,
  login: `${URLBASE}${apiVersion}/login`,
  favoritesAction: `${URLBASE}${apiVersion}/favorites/action`,
  favoritesMy: `${URLBASE}${apiVersion}/favorites/my`,
  favoritesProduct: `${URLBASE}${apiVersion}/favorites/product`,
  cart: `${URLBASE}${apiVersion}/cart`,
  orders: `${URLBASE}${apiVersion}/orders`,
  purchases: `${URLBASE}${apiVersion}/orders/my`,
  purchasesDetail: `${URLBASE}${apiVersion}/orders/my/detail`
}
