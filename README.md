<div align = center>
  <h1>vue-vis-network2</h1>
  <img alt="NPM License" src="https://img.shields.io/npm/l/vue-vis-network2">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/vue-vis-network2">
</div>

Vue 3 component to integrate with [Vis-Network](https://github.com/visjs/vis-network/) views  
Inspired by [vue-vis-network](https://github.com/r3code/vue-vis-network/)

## Features

- **Vue 3 & TypeScript** - Full type safety with Composition API and `<script setup>` syntax
- **Flexible Data Binding** - Support for Array, DataSet, and DataView with reactive updates
- **Generic Support** - Type-safe custom node/edge ID types
- **Complete Event System** - All Vis-network events with proper type inference
- **Exposed API** - Direct access to network instance and data methods

## Installation

```bash
npm install vue-vis-network2
```

## Quick Start

### Basic Example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VueVisNetwork, type Node, type Edge, type Options } from 'vue-vis-network2';

const nodes = ref<Node[]>([
  { id: 1, label: 'Node 1' },
  { id: 2, label: 'Node 2' },
  { id: 3, label: 'Node 3' },
  { id: 4, label: 'Node 4' },
  { id: 5, label: 'Node 5' },
]);

const edges = ref<Edge[]>([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
]);

const options = ref<Options>({
  nodes: {
    shape: 'dot',
    size: 16,
  },
  edges: {
    smooth: false,
  },
});
</script>

<template>
  <vue-vis-network
    :nodes="nodes"
    :edges="edges"
    :options="options"
    style="height: 400px"
  />
</template>
```

### With Events and Methods

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { VueVisNetwork, type Node, type Edge, type Options } from 'vue-vis-network2';

const nodes = ref<Node[]>([
  { id: 1, label: 'Node 1' },
  { id: 2, label: 'Node 2' },
  { id: 3, label: 'Node 3' },
]);

const edges = ref<Edge[]>([
  { from: 1, to: 2 },
  { from: 2, to: 3 },
]);

const options = ref<Options>({
  nodes: {
    shape: 'circle',
    size: 24,
    color: {
      border: '#2B7CE9',
      background: '#97C2FC',
    },
  },
});

const networkRef = ref();

// Handle click events
const handleClick = (params) => {
  console.log('Clicked node:', params.nodes);
  console.log('Clicked edge:', params.edges);
};

// Access network instance and methods
onMounted(() => {
  // Get vis-network instance
  const network = networkRef.value.network;
  console.log('Network instance:', network);
  
  // Get node data
  const node = networkRef.value.getNode(1);
  console.log('Node 1:', node);
  
  // Get edge data
  const edge = networkRef.value.getEdge(1);
  console.log('Edge 1:', edge);
});
</script>

<template>
  <vue-vis-network
    ref="networkRef"
    :nodes="nodes"
    :edges="edges"
    :options="options"
    @click="handleClick"
    @select-node="(params) => console.log('Selected:', params)"
    style="height: 400px; border: 1px solid #ccc"
  />
</template>
```

## TypeScript Generics

Use generics to specify custom node and edge ID types:

```vue
<script setup lang="ts">
import type { NetworkClickEvent } from 'vue-vis-network2';

const handleClick = (params: NetworkClickEvent<number, number>) => {
  console.log(params.nodes); // number[]
  console.log(params.edges); // number[]
};
</script>

<template>
  <!-- @vue-generic {number, number} -->
  <vue-vis-network
    :nodes="nodes"
    :edges="edges"
    @click="handleClick"
  />
</template>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `Node[]` \| `DataSet<Node>` \| `DataView<Node>` | `[]` | Network nodes |
| `edges` | `Edge[]` \| `DataSet<Edge>` \| `DataView<Edge>` | `[]` | Network edges |
| `options` | `Options` | `{}` | Vis-network configuration options |
| `events` | `EventKey[]` | All events | Array of event names to subscribe to |
| `style` | `StyleValue` | `{}` | Inline styles for the container |
| `class` | `any` | `undefined` | CSS class for the container |

### Exposed Methods

Access network instance and data via template ref:

```typescript
const networkRef = ref();

networkRef.value.network;      // Network - Get vis-network instance
networkRef.value.getNode(id);  // Node | null - Get node by ID
networkRef.value.getEdge(id);  // Edge | null - Get edge by ID
```

## Events

### Network Events

All [Vis-network events](https://visjs.github.io/vis-network/docs/network/#Events) are emitted by default. Subscribe to specific events using the `events` prop:

```vue
<vue-vis-network 
  :nodes="nodes"
  :edges="edges"
  :options="options"
  :events="['selectNode', 'hoverNode']"
  @select-node="onNodeSelected"
  @hover-node="onNodeHovered"
/>
```

### DataSet Events

When passing an Array, it's converted to a DataSet internally. DataSet events are emitted with prefixed names:
- **Mounted events**: `nodes-mounted`, `edges-mounted` - Fired when DataSet is created
- **Data events**: `nodes-add`, `nodes-update`, `nodes-remove`, `edges-add`, `edges-update`, `edges-remove`

Example payload for `nodes-add`:

```typescript
{
  event: 'add',
  properties: { items: [7] },
  senderId: null,
}
```

Learn more about [DataSet events](https://visjs.github.io/vis-data/data/dataset.html#Events).

### Event Reference

| Event Name | Payload Type | Description |
|------------|--------------|-------------|
| `click` | `NetworkClickEvent` | Fired when the user clicks |
| `doubleClick` | `NetworkBaseEvent` | Fired when the user double clicks |
| `oncontext` | `NetworkBaseEvent` | Fired when the user right clicks (context menu) |
| `hold` | `NetworkBaseEvent` | Fired when the user holds (touch or mouse) |
| `release` | `NetworkBaseEvent` | Fired when the user releases |
| `select` | `NetworkBaseEvent` | Fired when nodes or edges are selected |
| `selectNode` | `NetworkBaseEvent` | Fired when a node is selected |
| `selectEdge` | `NetworkBaseEvent` | Fired when an edge is selected |
| `deselectNode` | `NetworkDeselectEvent` | Fired when a node is deselected |
| `deselectEdge` | `NetworkDeselectEvent` | Fired when an edge is deselected |
| `dragStart` | `NetworkBaseEvent` | Fired when dragging starts |
| `dragging` | `NetworkBaseEvent` | Fired while dragging |
| `dragEnd` | `NetworkBaseEvent` | Fired when dragging ends |
| `controlNodeDragging` | `NetworkControlNodeDraggingEvent` | Fired while dragging a control node |
| `controlNodeDragEnd` | `NetworkControlNodeDraggingEvent` | Fired when control node dragging ends |
| `hoverNode` | `NetworkNodeEvent` | Fired when hovering over a node |
| `blurNode` | `NetworkNodeEvent` | Fired when leaving a node |
| `hoverEdge` | `NetworkEdgeEvent` | Fired when hovering over an edge |
| `blurEdge` | `NetworkEdgeEvent` | Fired when leaving an edge |
| `zoom` | `NetworkZoomEvent` | Fired when the view is zoomed |
| `showPopup` | `Id` | Fired when a popup is shown |
| `hidePopup` | - | Fired when a popup is hidden |
| `startStabilizing` | - | Fired when stabilization starts |
| `stabilizationProgress` | `NetworkStabilizationProgressEvent` | Fired during stabilization |
| `stabilizationIterationsDone` | - | Fired when stabilization iterations are done |
| `stabilized` | `NetworkStabilizedEvent` | Fired when stabilization is finished |
| `resize` | `NetworkResizeEvent` | Fired when the network is resized |
| `initRedraw` | - | Fired before redraw |
| `beforeDrawing` | `CanvasRenderingContext2D` | Fired before drawing on canvas |
| `afterDrawing` | `CanvasRenderingContext2D` | Fired after drawing on canvas |
| `animationFinished` | - | Fired when animation is finished |
| `configChange` | `any` | Fired when configuration changes |
| `nodes-mounted` | `DataSet<Node>` | Fired when nodes DataSet is mounted |
| `nodes-add` | `AddEventPayload` | Fired when nodes are added |
| `nodes-update` | `UpdateEventPayload` | Fired when nodes are updated |
| `nodes-remove` | `RemoveEventPayload` | Fired when nodes are removed |
| `edges-mounted` | `DataSet<Edge>` | Fired when edges DataSet is mounted |
| `edges-add` | `AddEventPayload` | Fired when edges are added |
| `edges-update` | `UpdateEventPayload` | Fired when edges are updated |
| `edges-remove` | `RemoveEventPayload` | Fired when edges are removed |

## Resources

- [Vis-Network API Documentation](https://visjs.github.io/vis-network/docs/network/)
- [DataSet Documentation](https://visjs.github.io/vis-data/data/dataset.html)
- [DataView Documentation](https://visjs.github.io/vis-data/data/dataview.html)

## License

MIT
