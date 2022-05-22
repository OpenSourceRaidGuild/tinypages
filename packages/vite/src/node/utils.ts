import consolaPkg from "consola";
import { murmurHash } from "ohash";
import Helmet from "preact-helmet";
import renderToString from "preact-render-to-string";
import type { Page } from "../types/types";
import { h } from "preact";

export function appendPrelude(content: string, page: Page) {
  page.meta.head.script.push({
    type: "text/javascript",
    innerHTML: `window.pageCtx=${JSON.stringify(
      page.pageCtx
    )};window.ssrProps=${JSON.stringify(page.global.ssrProps)}`,
  });
  renderToString(h(Helmet, page.meta.head, null)); // to make rewind work

  const HelmetHead = Helmet.rewind();
  const html = String.raw`
      <!doctype html>
      <html${HelmetHead.htmlAttributes.toString()}>
          <head>
              ${HelmetHead.title.toString()}
              ${HelmetHead.meta.toString()}
              ${HelmetHead.link.toString()}
              ${HelmetHead.script.toString()}
              ${HelmetHead.noscript.toString()}
              ${HelmetHead.base.toString()}
              ${HelmetHead.style.toString()}
              ${page.meta.headTags.join("\n")}
          </head>
          <body>
              <div id="app">
                  ${content}
              </div>
          </body>
      </html>
  `.trim();
  return html;
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function hash(content: string) {
  return murmurHash(content);
}

export function normalizeUrl(url: string) {
  let normalizedUrl = url.endsWith("/")
    ? url + "index"
    : url.replace(/\..*?$/, "");
  return normalizedUrl;
}

export function createConsola() {
  const { Consola, FancyReporter, LogLevel } =
    consolaPkg as unknown as typeof import("consola");

  const consola = new Consola({
    level: LogLevel.Debug,
    reporters: [new FancyReporter()],
  });

  return consola;
}

export function createElement(
  tag: string,
  params: Record<string, any>,
  content: string
) {
  const paramsString = Object.keys(params).reduce(
    (prev, curr) =>
      `${prev} ${curr}${
        typeof params[curr] !== "undefined" ? `="${params[curr]}"` : ""
      }`,
    ""
  );
  return `<${tag} ${paramsString}>${content}</${tag}>`;
}
