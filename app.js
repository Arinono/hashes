const http = require('http')
const crypto = require('crypto')

const methods = [
  '/md5',
  '/md4',
  '/sha512',
  '/sha384',
  '/sha256',
  '/sha224',
  '/sha1',
  '/mdc2',
  '/ripemd160'
]
const hash = (content = '', method = 'md5') => crypto.createHash(method).update(content).digest('hex')

http.createServer((req, res) => {
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })
  req.on('end', () => {
    if (!methods.includes(req.url)) {
      res.writeHead(404)
      res.end()
    } else {
      let content
      try {
        content = JSON.parse(body).content.toString()
      } catch (e) {
        res.writeHead(400)
        res.end()
      }

      const ret = hash(content, req.url.replace('/', ''))
      res.writeHead(200, {'Content-Length': Buffer.byteLength(ret), 'Content-Type': 'text/plain'})
      res.end(ret)
    }
  })
}).listen(process.env.PUBSUB_PORT || 5000)
