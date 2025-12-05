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
export type FullItem<
  Item extends PartItem<IdProp>,
  IdProp extends string
> = Item & Record<IdProp, Id>;

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

export interface NetworkBaseEvent<NodeId extends Id, EdgeId extends Id> {
  nodes: NodeId[];
  edges: EdgeId[];
  event: Event;
  pointer: {
    DOM: { x: number; y: number };
    canvas: { x: number; y: number };
  };
}

export type NetworkClickEvent<
  NodeId extends Id,
  EdgeId extends Id
> = NetworkBaseEvent<NodeId, EdgeId> & {
  items: { nodeId: NodeId; labelId?: 0 }[] | { edgeId: EdgeId; labelId?: 0 }[];
};

export type NetworkDeselectEvent<
  NodeId extends Id,
  EdgeId extends Id
> = NetworkBaseEvent<NodeId, EdgeId> & {
  previousSelection: {
    nodes: any[];
    edges: any[];
  };
};

export type NetworkControlNodeDraggingEvent<
  NodeId extends Id,
  EdgeId extends Id
> = NetworkBaseEvent<NodeId, EdgeId> & {
  controlEdge: { from: EdgeId | undefined; to: EdgeId | undefined };
};

export type NetworkNodeEvent<NodeId extends Id> = {
  node: NodeId;
  event: Event;
  pointer: {
    DOM: { x: number; y: number };
    canvas: { x: number; y: number };
  };
};

export type NetworkEdgeEvent<EdgeId extends Id> = {
  edge: EdgeId;
  event: Event;
  pointer: {
    DOM: { x: number; y: number };
    canvas: { x: number; y: number };
  };
};

export type NetworkZoomEvent = {
  direction: "+" | "-";
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
