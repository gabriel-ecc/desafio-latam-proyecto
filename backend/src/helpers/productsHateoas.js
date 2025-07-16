import "dotenv/config";
const port = process.env.port || 3000;


export const productsHATEOAS = async (entity, data, count) => {
  const results = data.map((item) => {
    return {
      id: item.id,
      name: item.productname,
      seasion: item.season,
      category: item.category,
      price: item.price,
      stock: item.stock,
      img: `http://localhost:${port}/${item.img}`,
      category_id: item.category_id,
      season_id: item.season_id,
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