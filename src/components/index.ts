import type { App } from "vue";
import VisNetwork from "./VisNetwork.vue";

VisNetwork.install = (app: App) => {
  app.component(VisNetwork.__name as string, VisNetwork);
};

export default VisNetwork;
