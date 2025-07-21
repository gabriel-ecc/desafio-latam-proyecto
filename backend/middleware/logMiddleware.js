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
    // 4. Usar await para escribir en el archivo. Si no existe, se crea.
    await appendFile('verduleria.log', logEntry)
  } catch (err) {
    // Si hay un error al escribir el archivo (ej: permisos), lo mostramos en la consola
    // pero no detenemos el flujo de la aplicación.
    console.error('Error al escribir en el archivo de log:', err)
  }

  next()
}
