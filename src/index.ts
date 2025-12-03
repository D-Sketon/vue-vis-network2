import type { App } from "vue";
import VueVisNetwork from "./components";

const install = (app: App): void => {
  app.component((VueVisNetwork as any).__name as string, VueVisNetwork);
};

export { VueVisNetwork };

// Export all types from vis-network and vis-data
export type * from "vis-network";
export type * from "vis-data";

export default {
  install,
};

export type {
  EventKey,
  NetworkBaseEvent,
  NetworkClickEvent,
  NetworkDeselectEvent,
  NetworkControlNodeDraggingEvent,
  NetworkNodeEvent,
  NetworkEdgeEvent,
  NetworkZoomEvent,
  NetworkStabilizationProgressEvent,
  NetworkResizeEvent,
  NetworkStabilizedEvent,
  AddEventPayload,
  UpdateEventPayload,
  RemoveEventPayload,
} from "./components/events";
