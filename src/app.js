const http = require('http')
const client = require('prom-client')

const PORT = process.env.PORT || 3000
const register = new client.Registry()
client.collectDefaultMetrics({ register })

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
})

const routes = {
  '/': () => [200, 'text/plain; charset=utf-8', 'DevOps Final Project'],
  '/health': () => [200, 'application/json', JSON.stringify({ status: 'ok' })]
}

async function handle(method, url) {
  if (url === '/metrics') return [200, register.contentType, await register.metrics()]
  const handler = routes[url]
  const response = handler ? handler() : [404, 'application/json', JSON.stringify({ error: 'Not found' })]
  httpRequests.inc({ method, route: handler ? url : 'unknown', status: response[0] })
  return response
}

const server = http.createServer(async (req, res) => {
  const [status, type, body] = await handle(req.method, req.url)
  res.writeHead(status, { 'Content-Type': type })
  res.end(body)
})

if (require.main === module) {
  server.listen(PORT, () => console.log(`DevOps Final Project on port ${PORT}`))
}

module.exports = { handle, server, register }
