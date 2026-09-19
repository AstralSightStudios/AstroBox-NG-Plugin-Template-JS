# AstroBox 插件模板（JavaScript）

AstroBox **API Level 4** 的 JavaScript 插件模板。

## 重要：需要打过补丁的 ComponentizeJS

上游 ComponentizeJS 尚未实现 `async func`，而 Level 4 的接口全是 `async func`，
直接用官方版本会报：

```
thread '<unnamed>' panicked at crates/spidermonkey-embedding-splicer/src/bindgen.rs:719:
not yet implemented
```

本模板的 `package.json` 因此指向我们维护的分支
[`AstralSightStudios/ComponentizeJS@astrobox/async-func-support`](https://github.com/AstralSightStudios/ComponentizeJS/tree/astrobox/async-func-support)，
它把 async 函数按**同步 lower / 同步 lift** 处理（这在组件模型里是合法的）。
等上游合入后即可切回官方包。

> 用 git 依赖时 npm 会现场构建 splicer，需要本机有 Rust 与 `wasm32-wasip1` target：
> `rustup target add wasm32-wasip1`

## 使用

```bash
git submodule update --init --recursive   # 拉 wit/
npm install
npm run build          # 构建到 dist/
npm run package        # 顺便打 .abp
```

## 写插件时要知道的

- **WIT 的 enum 在 JS 里是字符串**：`new Element('div', ...)`，不是 `ElementType.DIV`。
- **宿主接口虽然声明为 `async func`，在 JS 侧是同步调用**：被同步 lower 了，
  调用期间 JS 线程阻塞到宿主返回，不要 `await`（await 一个非 Promise 也无害）。
- 导出的函数可以是 `async`，引擎会在返回前把 Promise 结算掉。
- 产物约 14 MB（内嵌 SpiderMonkey）。
