export const authorizationMiddleware = (req, res, next) => {
  console.log(req.user)
  next()
}
