import 'dotenv/config'
// const port = process.env.port || 3000

export const productsHATEOAS = async (entity, data, count) => {
  const results = data.map(item => {
    return {
      id: item.id,
      productname: item.productname, // Mantener el nombre original que usa el frontend
      name: item.productname, // También agregar como 'name' por compatibilidad
      description: item.description, // Agregar descripción
      season: item.season,
      category: item.category,
      categoryId: item.category_id,
      seasonId: item.season_id,
      price: item.price,
      stock: item.stock,
      status: item.status, // Agregar status para habilitar/deshabilitar
      img: `${process.env.RENDER_EXTERNAL_URL}/api/v1/uploads/${item.img}`,
      category_id: item.category_id,
      season_id: item.season_id,
      href: `${process.env.RENDER_EXTERNAL_URL}/api/v1/${entity}/${item.id}`
    }
  })

  const total = data.length
  const dataWithHateoas = {
    totalInPage: total,
    totalProducts: Number(count.cantidad),
    results
  }
  return dataWithHateoas
}
