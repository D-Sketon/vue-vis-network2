<script setup lang="ts" generic="NodeId extends Id = string, EdgeId extends Id = string">
import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  StyleValue,
} from "vue";
import {
  Network,
  Node,
  Edge,
  Options,
  IdType,
  Data,
} from "vis-network";
import { DataSet, DataView } from "vis-data";
import {
  EventKey,
  Id,
  NetworkClickEvent,
  NetworkBaseEvent,
  NetworkDeselectEvent,
  NetworkControlNodeDraggingEvent,
  NetworkNodeEvent,
  NetworkEdgeEvent,
  NetworkZoomEvent,
  NetworkStabilizationProgressEvent,
  NetworkStabilizedEvent,
  NetworkResizeEvent,
  AddEventPayload,
  UpdateEventPayload,
  RemoveEventPayload,
} from "./events";

const props = withDefaults(defineProps<{
  nodes?: Node[] | DataSet<Node> | DataView<Node>;
  edges?: Edge[] | DataSet<Edge> | DataView<Edge>;
  options?: Options;
  events?: EventKey[];
  style?: StyleValue;
  class?: any;
}>(), {
  nodes: () => [] as Node[],
  edges: () => [] as Edge[],
  options: () => ({}),
  events: () => Object.values(EventKey),
  style: () => ({}),
});

const emit = defineEmits<{
  click: [params: NetworkClickEvent<NodeId, EdgeId>];
  doubleClick: [params: NetworkBaseEvent<NodeId, EdgeId>];
  oncontext: [params: NetworkBaseEvent<NodeId, EdgeId>];
  hold: [params: NetworkBaseEvent<NodeId, EdgeId>];
  release: [params: NetworkBaseEvent<NodeId, EdgeId>];
  select: [params: NetworkBaseEvent<NodeId, EdgeId>];
  selectNode: [params: NetworkBaseEvent<NodeId, EdgeId>];
  selectEdge: [params: NetworkBaseEvent<NodeId, EdgeId>];
  deselectNode: [params: NetworkDeselectEvent<NodeId, EdgeId>];
  deselectEdge: [params: NetworkDeselectEvent<NodeId, EdgeId>];
  dragStart: [params: NetworkBaseEvent<NodeId, EdgeId>];
  dragging: [params: NetworkBaseEvent<NodeId, EdgeId>];
  dragEnd: [params: NetworkBaseEvent<NodeId, EdgeId>];
  controlNodeDragging: [params: NetworkControlNodeDraggingEvent<NodeId, EdgeId>];
  controlNodeDragEnd: [params: NetworkControlNodeDraggingEvent<NodeId, EdgeId>];
  hoverNode: [params: NetworkNodeEvent<NodeId>];
  blurNode: [params: NetworkNodeEvent<NodeId>];
  hoverEdge: [params: NetworkEdgeEvent<EdgeId>];
  blurEdge: [params: NetworkEdgeEvent<EdgeId>];
  zoom: [params: NetworkZoomEvent];
  showPopup: [params: Id];
  hidePopup: [];
  startStabilizing: [];
  stabilizationProgress: [params: NetworkStabilizationProgressEvent];
  stabilizationIterationsDone: [];
  stabilized: [params: NetworkStabilizedEvent];
  resize: [params: NetworkResizeEvent];
  initRedraw: [];
  beforeDrawing: [params: CanvasRenderingContext2D];
  afterDrawing: [params: CanvasRenderingContext2D];
  animationFinished: [];
  configChange: [params: any];
  "edges-mounted": [params: DataSet<Edge>];
  "nodes-mounted": [params: DataSet<Node>];
  "edges-add": [params: AddEventPayload | null, senderId?: Id | null];
  "edges-update": [params: UpdateEventPayload<Edge, "id"> | null, senderId?: Id | null];
  "edges-remove": [params: RemoveEventPayload<Edge, "id"> | null, senderId?: Id | null];
  "nodes-add": [params: AddEventPayload | null, senderId?: Id | null];
  "nodes-update": [params: UpdateEventPayload<Node, "id"> | null, senderId?: Id | null];
  "nodes-remove": [params: RemoveEventPayload<Node, "id"> | null, senderId?: Id | null];
}>();

const visualizationRef = shallowRef<HTMLDivElement | null>(null);
const visData = ref<{
  nodes?: DataSet<Node>;
  edges?: DataSet<Edge>;
}>({
  nodes: undefined as DataSet<Node> | undefined,
  edges: undefined as DataSet<Edge> | undefined,
});

const network = ref<Network>();

const getNode = (id: IdType): Node | null => {
  return (visData.value.nodes?.get(id) as Node) || null;
};

const getEdge = (id: IdType): Edge | null => {
  return (visData.value.edges?.get(id) as Edge) || null;
};

watch(
  () => props.options,
  () => {
    network.value && network.value.setOptions(props.options);
  },
  { deep: true }
);

const arrayDiff = (arr1: any[], arr2: any[]) =>
  arr1.filter((x) => arr2.indexOf(x) === -1);

function mountVisData(propName: "nodes"): DataSet<Node>;
function mountVisData(propName: "edges"): DataSet<Edge>;
function mountVisData(propName: "nodes" | "edges") {
  let data = props[propName];

  // If data is DataSet or DataView we return early without attaching our own events
  if (!(props[propName] instanceof DataSet)) {
    data = new DataSet(props[propName] as any[]);

    // Rethrow all events
    data.on("*", (event, properties, senderId) =>
      emit(`${propName}-${event}` as any, { event, properties, senderId })
    );

    // Use watch to replace $watch in Vue 2
    watch(
      () => props[propName],
      (value) => {
        if (Array.isArray(value)) {
          const newIds = new DataSet(value as any[]).getIds();
          const diff = arrayDiff(
            (visData.value[propName] as DataSet<any>).getIds(),
            newIds
          );
          (visData.value[propName] as DataSet<any>).update(value);
          (visData.value[propName] as DataSet<any>).remove(diff);
        }
      },
      { deep: true }
    );
  }

  // Emitting DataSets back
  emit(`${propName}-mounted` as any, data);

  return data as DataSet<Node> | DataSet<Edge>;
}

onMounted(() => {
  const container = visualizationRef.value;
  visData.value = {
    nodes: mountVisData("nodes"),
    edges: mountVisData("edges"),
  };
  network.value = new Network(container!, visData.value, props.options);

  network.value.setData = (data: Data) => {
    data.nodes = data.nodes || visData.value.nodes;
    data.edges = data.edges || visData.value.edges;
    visData.value.nodes = Array.isArray(data.nodes) ? new DataSet(data.nodes) : data.nodes as DataSet<Node>;
    visData.value.edges = Array.isArray(data.edges) ? new DataSet(data.edges) : data.edges as DataSet<Edge>;
    Object.getPrototypeOf(network).setData(visData.value);
  };

  props.events.forEach((eventName) => {
    network.value && network.value.on(eventName, (props) => emit(eventName as any, props));
  });
});

onBeforeUnmount(() => {
  network.value && network.value.destroy();
});

defineExpose({
  network,
  getNode,
  getEdge,
});
</script>

<template>
  <div ref="visualizationRef" :class="props.class" :style="props.style"></div>
</template>
