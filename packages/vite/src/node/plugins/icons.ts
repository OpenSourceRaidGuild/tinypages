import Icons from "node-icons";
import type { Plugin } from "vite";
import { useContext } from "../context";

export default function (): Plugin {
  const { config } = useContext();
  const icons = Icons(config.modules.icons);
  const separator = config.modules.icons?.separator || ":";
  const moduleMap: Map<string, string> = new Map();
  const stringifiedDefaults = JSON.stringify(
    config.modules.icons.defaultIconsStyles || {}
  );
  return {
    name: "vite-tinypages-icons",
    async resolveId(id: string) {
      if (moduleMap.has(id)) {
        return id;
      }
      if (id.startsWith("~icons/")) {
        const parts = id.split("~icons/").slice(1)[0].split("/");
        const res = icons.getIconsSync(
          parts[0] + separator + parts[1],
          {},
          false
        );
        if (res) {
          moduleMap.set(id, res);
          return id;
        }
      }
    },
    load(id: string) {
      const res = moduleMap.get(id);
      if (res) {
        // preact js component
        return `
        import { h } from "preact";
        import { stringifyObject } from "@tinypages/compiler/utils";
        export default function(props){
          const initial = "<svg "+ wrapObject(props||${stringifiedDefaults});
          return h("span", {
          dangerouslySetInnerHTML: { __html: ${
            "initial" + "+ `" + res.split("<svg")[1] + "`"
          } },
          });
        }
        `;
      }
    },
  };
}
