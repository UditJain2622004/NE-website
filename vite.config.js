import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function vercelApiPlugin() {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()

        const urlObj = new URL(req.url, 'http://localhost')
        const apiPath = urlObj.pathname.replace(/^\/api\//, '')
        const filePath = path.resolve(__dirname, 'api', `${apiPath}.js`)

        try {
          const timestamp = Date.now()
          const mod = await server.ssrLoadModule(`/api/${apiPath}.js?t=${timestamp}`)
          const handler = mod.default

          let body = ''
          await new Promise((resolve) => {
            req.on('data', (chunk) => { body += chunk })
            req.on('end', resolve)
          })

          const fakeReq = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            query: Object.fromEntries(urlObj.searchParams),
            body: body ? JSON.parse(body) : {},
          }

          const fakeRes = {
            statusCode: 200,
            _headers: { 'content-type': 'application/json' },
            status(code) { this.statusCode = code; return this },
            setHeader(k, v) { this._headers[k] = v; return this },
            json(data) {
              res.writeHead(this.statusCode, this._headers)
              res.end(JSON.stringify(data))
            },
            send(data) {
              res.writeHead(this.statusCode, this._headers)
              res.end(typeof data === 'string' ? data : JSON.stringify(data))
            },
            end(data) {
              res.writeHead(this.statusCode, this._headers)
              res.end(data)
            },
          }

          await handler(fakeReq, fakeRes)
        } catch (err) {
          console.error(`[API] Error in /api/${apiPath}:`, err)
          res.writeHead(500, { 'content-type': 'application/json' })
          res.end(JSON.stringify({ success: false, error: err.message }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vercelApiPlugin(),
  ],
  server: {
    port: 5173,
    host: true
  }
})
