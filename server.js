const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const fse = require("fs-extra");
const path = require("path");

const app = new Koa();
const router = new Router();

router.get(
  ["/", "/index.html", "/viewer/:package/:version?"],
  async (ctx, next) => {
    let indexHtml = path.join(__dirname, "./dist/index.html");
    let html = await (await fse.readFile(indexHtml)).toString();
    ctx.body = html
      .replace("unpkg_url", process.env.UNPKG_URL)
      .replace("verdaccio_url", process.env.VERDACCIO_URL)
      .replace("pkg_prefix", process.env.PKG_PREFIX);
  }
);

app.use(router.routes()).use(router.allowedMethods());

app.use(serve(path.join(__dirname, "./dist"), {}));

let PORT = process.env.PORT || 4875;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
