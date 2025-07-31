// eslint.config.js en la raíz de tu carpeta 'backend'
import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginJest from 'eslint-plugin-jest'

export default [
  {
    files: ['**/*.js', '**/*.mjs'], // Aplica a archivos .js y .mjs en tu backend
    languageOptions: {
      globals: {
        ...globals.node, // Para las variables globales de Node.js (ej. process, require, module)
        ...globals.jest // Para las funciones globales de Jest (describe, it, expect, beforeEach, afterEach, etc.)
      },
      ecmaVersion: 2022, // Soporte para ES2022 (compatible con Node.js 22)
      sourceType: 'module' // Importante porque usas 'type': 'module' en tu package.json
    },
    plugins: {
      jest: pluginJest // Registra el plugin de Jest
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Reglas básicas recomendadas de ESLint
      ...pluginJest.configs.recommended.rules, // Reglas recomendadas para Jest
      // Aquí puedes añadir tus reglas personalizadas o sobrescribir las existentes
      // Ejemplo de una regla que desactiva los punto y coma al final de línea (según tu preferencia):
      semi: ['error', 'never']
    }
  }
  // Si tienes más configuraciones específicas (ej. para un directorio 'src' vs 'test'),
  // puedes añadir más objetos de configuración a este array.
]
