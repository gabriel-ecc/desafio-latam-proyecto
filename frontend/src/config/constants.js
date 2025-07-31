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
  login: `${URLBASE}${apiVersion}/login`
}
