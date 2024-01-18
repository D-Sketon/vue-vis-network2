import type { App } from "vue";
import VueVisNetwork from "./components";

const install = (app: App): void => {
  app.component(VueVisNetwork.__name as string, VueVisNetwork);
};

export { VueVisNetwork };

export default {
  install,
};
