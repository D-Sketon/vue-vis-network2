import { Edge, Node } from "vis-network";
/** Nullable id type. */
export type OptId = undefined | null | Id;
/**
 * An item that may ({@link Id}) or may not (absent, undefined or null) have an id property.
 * @typeParam IdProp - Name of the property that contains the id.
 */
export type PartItem<IdProp extends string> = Partial<Record<IdProp, OptId>>;
/**
 * An item that has a property containing an id and all other required properties of given item type.
 * @typeParam Item - Item type that may or may not have an id.
 * @typeParam IdProp - Name of the property that contains the id.
 */
export type FullItem<Item extends PartItem<IdProp>, IdProp extends string> = Item &
  Record<IdProp, Id>;

/** Valid id type. */
export type Id = number | string;
/** Add event payload. */
export interface AddEventPayload {
  /** Ids of added items. */
  items: Id[];
}
/** Remove event payload. */
export interface RemoveEventPayload<
  Item extends PartItem<IdProp>,
  IdProp extends string
> {
  /** Ids of removed items. */
  items: Id[];
  /** Items as they were before their removal. */
  oldData: FullItem<Item, IdProp>[];
}
/** Update event payload. */
export interface UpdateEventPayload<
  Item extends PartItem<IdProp>,
  IdProp extends string
> {
  /** Ids of updated items. */
  items: Id[];
  /** Items as they were before this update. */
  oldData: FullItem<Item, IdProp>[];
  /**
   * Items as they are now.
   * @deprecated Just get the data from the data set or data view.
   */
  data: FullItem<Item, IdProp>[];
}

export enum EventKey {
  CLICK = "click",
  DOUBLE_CLICK = "doubleClick",
  ON_CONTEXT = "oncontext",
  HOLD = "hold",
  RELEASE = "release",
  SELECT = "select",
  SELECT_NODE = "selectNode",
  SELECT_EDGE = "selectEdge",
  DESELECT_NODE = "deselectNode",
  DESELECT_EDGE = "deselectEdge",
  DRAG_START = "dragStart",
  DRAGGING = "dragging",
  DRAG_END = "dragEnd",
  CONTROL_NODE_DRAGGING = "controlNodeDragging",
  CONTROL_NODE_DRAG_END = "controlNodeDragEnd",
  HOVER_NODE = "hoverNode",
  BLUR_NODE = "blurNode",
  HOVER_EDGE = "hoverEdge",
  BLUR_EDGE = "blurEdge",
  ZOOM = "zoom",
  SHOW_POPUP = "showPopup",
  HIDE_POPUP = "hidePopup",
  START_STABILIZING = "startStabilizing",
  STABILIZATION_PROGRESS = "stabilizationProgress",
  STABILIZATION_ITERATIONS_DONE = "stabilizationIterationsDone",
  STABILIZED = "stabilized",
  RESIZE = "resize",
  INIT_REDRAW = "initRedraw",
  BEFORE_DRAWING = "beforeDrawing",
  AFTER_DRAWING = "afterDrawing",
  ANIMATION_FINISHED = "animationFinished",
  CONFIG_CHANGE = "configChange",
}

export interface NetworkBaseEvent {
  nodes: string[];
  edges: string[];
  event: Event;
  pointer: {
    DOM: { x: number; y: number };
    canvas: { x: number; y: number };
  };
}

export type NetworkClickEvent = NetworkBaseEvent & {
  items:
    | { nodeId: string; labelId?: number }[]
    | { edgeId: string; labelId?: number }[];
};

export type NetworkDeselectEvent = NetworkBaseEvent & {
  previousSelection: {
    nodes: any[];
    edges: any[];
  };
};

export type NetworkControlNodeDraggingEvent = NetworkBaseEvent & {
  controlEdge: { from: string; to: string };
};

export type NetworkNodeEvent = {
  node: string;
};

export type NetworkEdgeEvent = {
  edge: string;
};

export type NetworkZoomEvent = {
  direction: string;
  scale: number;
  pointer: {
    x: number;
    y: number;
  };
};

export type NetworkStabilizationProgressEvent = {
  iterations: number;
  total: number;
};

export type NetworkStabilizedEvent = {
  iterations: number;
};

export type NetworkResizeEvent = {
  width: number;
  height: number;
  oldWidth: number;
  oldHeight: number;
};

export const VueNetworkEvents = {
  [EventKey.CLICK]: (_param: NetworkClickEvent) => true,
  [EventKey.DOUBLE_CLICK]: (_param: NetworkBaseEvent) => true,
  [EventKey.ON_CONTEXT]: (_param: NetworkBaseEvent) => true,
  [EventKey.HOLD]: (_param: NetworkBaseEvent) => true,
  [EventKey.RELEASE]: (_param: NetworkBaseEvent) => true,
  [EventKey.SELECT]: (_param: NetworkBaseEvent) => true,
  [EventKey.SELECT_NODE]: (_param: NetworkBaseEvent) => true,
  [EventKey.SELECT_EDGE]: (_param: NetworkBaseEvent) => true,
  [EventKey.DESELECT_NODE]: (_param: NetworkDeselectEvent) => true,
  [EventKey.DESELECT_EDGE]: (_param: NetworkDeselectEvent) => true,
  [EventKey.DRAG_START]: (_param: NetworkBaseEvent) => true,
  [EventKey.DRAGGING]: (_param: NetworkBaseEvent) => true,
  [EventKey.DRAG_END]: (_param: NetworkBaseEvent) => true,
  [EventKey.CONTROL_NODE_DRAGGING]: (_param: NetworkControlNodeDraggingEvent) =>
    true,
  [EventKey.CONTROL_NODE_DRAG_END]: (_param: NetworkBaseEvent) => true,
  [EventKey.HOVER_NODE]: (_param: NetworkNodeEvent) => true,
  [EventKey.BLUR_NODE]: (_param: NetworkNodeEvent) => true,
  [EventKey.HOVER_EDGE]: (_param: NetworkEdgeEvent) => true,
  [EventKey.BLUR_EDGE]: (_param: NetworkEdgeEvent) => true,
  [EventKey.ZOOM]: (_param: NetworkZoomEvent) => true,
  [EventKey.SHOW_POPUP]: (_param: number) => true,
  [EventKey.HIDE_POPUP]: (_param: void) => true,
  [EventKey.START_STABILIZING]: (_param: void) => true,
  [EventKey.STABILIZATION_PROGRESS]: (
    _param: NetworkStabilizationProgressEvent
  ) => true,
  [EventKey.STABILIZATION_ITERATIONS_DONE]: (_param: void) => true,
  [EventKey.STABILIZED]: (_param: NetworkStabilizedEvent) => true,
  [EventKey.RESIZE]: (_param: NetworkResizeEvent) => true,
  [EventKey.INIT_REDRAW]: (_param: void) => true,
  [EventKey.BEFORE_DRAWING]: (_param: CanvasRenderingContext2D) => true,
  [EventKey.AFTER_DRAWING]: (_param: CanvasRenderingContext2D) => true,
  [EventKey.ANIMATION_FINISHED]: (_param: void) => true,
  [EventKey.CONFIG_CHANGE]: (_param: any) => true,
  "edges-mounted": () => true,
  "nodes-mounted": () => true,
  "edges-add": (
    _name: "add",
    _payload: AddEventPayload | null,
    _senderId?: Id | null
  ) => true,
  "edges-update": (
    _name: "update",
    _payload: UpdateEventPayload<Edge, "id"> | null,
    _senderId?: Id | null
  ) => true,
  "edges-remove": (
    _name: "remove",
    _payload: RemoveEventPayload<Edge, "id"> | null,
    _senderId?: Id | null
  ) => true,
  "nodes-add": (
    _name: "add",
    _payload: AddEventPayload | null,
    _senderId?: Id | null
  ) => true,
  "nodes-update": (
    _name: "update",
    _payload: UpdateEventPayload<Node, "id"> | null,
    _senderId?: Id | null
  ) => true,
  "nodes-remove": (
    _name: "remove",
    _payload: RemoveEventPayload<Node, "id"> | null,
    _senderId?: Id | null
  ) => true,
};
