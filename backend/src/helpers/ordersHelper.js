import 'dotenv/config'
const port = process.env.port || 3000

export const orderDetailsFormat = async data => {
  const results = data.map(item => {
    return {
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      img: `http://localhost:${port}/api/v1/uploads/${item.img}`
    }
  })
  return results
}
