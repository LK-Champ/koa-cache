const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();

const mimes = {
  css: 'text/css',
  less: 'text/css',
  gif: 'image/gif',
  html: 'text/html',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  js: 'text/javascript',
  json: 'application/json',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  swf: 'application/x-shockwave-flash',
  tiff: 'image/tiff',
  txt: 'text/plain',
  wav: 'audio/x-wav',
  wma: 'audio/x-ms-wma',
  wmv: 'video/x-ms-wmv',
  xml: 'text/xml',
};

function parseMime(url) {
  // path.extname获取路径中文件的后缀名
  let extName = path.extname(url)
  extName = extName ? extName.slice(1) : 'unknown'
  return mimes[extName]
}

const parseStatic = (dir) => {
  return new Promise((resolve) => {
    resolve(fs.readFileSync(dir), 'binary')
  })
}

app.use(async (ctx) => {
  const url = ctx.request.url
  if (url === '/') {
    // 访问根路径返回index.html
    ctx.set('Content-Type', 'text/html')
    ctx.body = await parseStatic('./index.html')
  } else {
    const filePath = path.resolve(__dirname, `.${url}`)
    ctx.set('Content-Type', parseMime(url))
    // 设置过期时间在30000毫秒，也就是30秒后
    ctx.set('Expires', new Date(Date.now() + 30000))
    ctx.body = await parseStatic(filePath)
  }
})


app.listen(8080, () => {
  console.log('starting at port 8080')
});