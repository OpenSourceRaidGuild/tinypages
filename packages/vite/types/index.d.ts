type PageCtx = /*start*/
  | { url: "/404.md" }
  | { url: "/favicon.ico" }
  | { url: "/index.md" }
  | { url: "/style.ts" }
  | { url: "/[...].md" }
  | { url: "/[id].md"; params: { id: string } }
  | { url: "/api/index.md" }
  | { url: "/api/[blog].md"; params: { blog: string } }
  | { url: "/api/[blog].ts"; params: { blog: string } }; /*end*/

declare global {
  var pageCtx: PageCtx;
  function pageProps(pageCtx: PageCtx): any;
}

export type { PageCtx };
