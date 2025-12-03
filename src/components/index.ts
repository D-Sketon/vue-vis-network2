import type { App } from "vue";
import VisNetwork from "./VisNetwork.vue";

(VisNetwork as any).install = (app: App) => {
  app.component((VisNetwork as any).__name as string, VisNetwork);
};

export default VisNetwork;
