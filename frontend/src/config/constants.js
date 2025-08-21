export const URLBASE = 'gatadecampobackend-f5febsb9b3btaqfc.chilecentral-01.azurewebsites.net:3000'
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
  dailySalesWeekly: `${URLBASE}${apiVersion}/dashboard/daily-sales-weekly`,
  newClientsWeekly: `${URLBASE}${apiVersion}/dashboard/new-clients-weekly`,
  inactiveClients: `${URLBASE}${apiVersion}/dashboard/inactive-clients`,
  topSellingProductsDaily: `${URLBASE}${apiVersion}/dashboard/top-selling-products-daily`,
  lowStockProducts: `${URLBASE}${apiVersion}/dashboard/low-stock-products`,
  purchases: `${URLBASE}${apiVersion}/orders/my`,
  purchasesDetail: `${URLBASE}${apiVersion}/orders/my/detail`,
  adminPurchases: `${URLBASE}${apiVersion}/orders/all`,
  adminPurchasesDetail: `${URLBASE}${apiVersion}/orders/all/detail`,
  updateOrderStatus: `${URLBASE}${apiVersion}/orders`
}
