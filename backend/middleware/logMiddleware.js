import { appendFile } from 'fs/promises'

export const verduleriaLog = async (req, _, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl || req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    auth: req.header('Authorization')
  }

  const logEntry = `${JSON.stringify(logData, null, 2)},\n`

  try {
    await appendFile('verduleria.log', logEntry)
  } catch (err) {
    console.error('Error al escribir en el archivo de log:', err)
  }

  next()
}
