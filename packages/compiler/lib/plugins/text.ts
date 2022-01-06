import * as emoji from "node-emoji";
import type { Config, Plugin } from "../types";
import { PluginCode } from "./code";
import iconsRenderer from "./helpers/icons";

export function PluginText(config: Config): Plugin {
  const codeTransformer = PluginCode(config);
  return {
    transform(id: string, payload: string) {
      if (id === "text" || id === "html")
        return payload.replace(
          /(::(.*?)::)|(`(.*?)`)|(:(.*?):)/g,
          (payload) => {
            if (
              (payload.includes("<") || payload.includes(">")) &&
              !payload.startsWith("`")
            ) {
              return payload;
            }
            if (payload.startsWith("::")) {
              const iconSvg = iconsRenderer(payload.slice(2, -2), {
                config,
              });
              return iconSvg ? iconSvg : payload;
            } else if (payload.startsWith("`")) {
              let [lang, ...code] = payload.slice(1, -1).split(" ");
              codeTransformer.tapArgs("code", [code.join(" "), lang]);
              return codeTransformer.transform("codespan", payload);
            } else {
              return emoji.get(payload);
            }
          }
        );
      return payload;
    },
  };
}
