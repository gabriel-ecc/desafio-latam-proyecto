import 'dotenv/config'
const port = process.env.port || 3000

export const favortiesHelper = async favList => {
  const resultado = favList.map(item => {
    return {
      id: item.productid,
      name: item.productName,
      price: item.price,
      category: item.category,
      categoryId: item.categoryId,
      season: item.season,
      seasonId: item.seasonId,
      stock: item.stock,
      isFavorite: true,
      favoriteId: item.favoriteId,
      img: `http://localhost:${port}/api/v1/uploads/${item.img}`
    }
  })
  return resultado
}
