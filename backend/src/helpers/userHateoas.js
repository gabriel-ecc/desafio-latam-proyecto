// import 'dotenv/config'
// const port = process.env.port || 3000

export const UserHATEOAS = async (entity, data, count) => {
  const results = data.map(item => {
    return {
      id: item.id,
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      user_status: item.user_status,
      user_type: item.user_type,
      profile_photo: item.profile_photo,
      href: `https://verduleria-3dbt.onrender.com/${entity}/${item.id}`
    }
  })

  const total = data.length
  const dataWithHateoas = {
    users: results,
    count: Number(count.cantidad),
    totalInPage: total
  }
  return dataWithHateoas
}
