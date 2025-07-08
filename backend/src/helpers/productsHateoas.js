import "dotenv/config";
const port = process.env.port || 3000;


export const productsHATEOAS = async (entity, data, count) => {
  const results = data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      seasion: item.seasion,
      category: item.category,
      price: item.price,
      stock: item.stock,
      photo: item.product_photo,
      hfef: `http://localhost:${port}/${entity}/${item.id}`,
    };
  });

  const total = data.length;
  const dataWithHateoas = {
    totalInPage: total,
    totalProducts: Number(count.cantidad),
    results,
  };
  return dataWithHateoas;
};