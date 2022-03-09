import { loadConfig } from "unconfig";
import { mergeConfig } from "vite";
import type { TinyPagesConfig, UserTinyPagesConfig } from "../types/types";
import { presetCompilerConfig, presetViteConfig } from "./constants";
const defu = require("defu");

export async function resolveConfig(
  cliViteConfig
): Promise<{ config: TinyPagesConfig; filePath: string }> {
  let { config, sources } = await loadConfig<Partial<UserTinyPagesConfig>>({
    sources: [
      {
        files: "tinypages.config",
        // default extensions
        extensions: ["ts", "mts", "cts", "js", "mjs", "cjs", "json", ""],
      },
    ],
  });

  const ext = defu.extend((obj, key, _) => {
    console.log(key);
    if (key === "vite") {
      obj[key] = mergeConfig(
        presetViteConfig,
        mergeConfig(obj[key] || {}, cliViteConfig)
      );
      return true;
    }
  });

  config = ext(config, {
    compiler: presetCompilerConfig,
    vite: mergeConfig(presetViteConfig, cliViteConfig),
    middlewares: {
      pre: [],
      post: [],
    },
    modules: {
      image: {},
      icons: {},
      unocss: {},
    },
  });
  //@ts-ignore
  config.compiler.resolveUnoCSS = false;
  //@ts-ignore
  config.compiler.icons = config.modules.icons;
  return { config, filePath: sources[0] } as {
    config: TinyPagesConfig;
    filePath: string;
  };
}
