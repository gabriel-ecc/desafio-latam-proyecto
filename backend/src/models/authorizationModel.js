import pool from '../../db/schema/config.js'

export const getPermissions = async (
  securityRoute,
  securityMethod,
  userType
) => {
  const sqlQuery = {
    text: `select * from security_actions as a inner join security_actions_roles as b on a.id = b.security_action_id where a.security_route = $1 and a.security_method = $2 and b.user_type_id = $3`,
    values: [securityRoute, securityMethod, userType]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}
