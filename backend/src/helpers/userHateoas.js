import "dotenv/config";
const port = process.env.port || 3000;

export const UserHATEOAS = async (entity, data, count) => {
  const results = data.map((item) => {
    return {
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      status: item.user_status,
      type: item.user_type,
      hfef: `http://localhost:${port}/${entity}/${item.id}`,
    };
  });

  const total = data.length;
  const dataWithHateoas = {
    totalInPage: total,
    totalUsers: Number(count.cantidad),
    results,
  };
  return dataWithHateoas;
};

