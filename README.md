<div align = center>
  <h1>vue-vis-network2</h1>
  <img alt="NPM License" src="https://img.shields.io/npm/l/vue-vis-network2">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/vue-vis-network2">

  [CodeSandBox](https://codesandbox.io/p/devbox/vue-vis-network2-example-78hs7p?file=%2Fsrc%2FApp.vue%3A219%2C16)
</div>

Vue3 component to integrate with [Vis-Network](https://github.com/visjs/vis-network/) views \
Inspired from [vue-vis-network](https://github.com/r3code/vue-vis-network/)

## Installation

```bash
npm install vue-vis-network2
```

## Usage

```html
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { VueVisNetwork } from "vue-vis-network2";
import { Edge, Node, Options } from "vis-network";

const defNodes: Node[] = [
  { id: 1, label: "Node 1" },
  { id: 2, label: "Node 2" },
  { id: 3, label: "Node 3" },
  { id: 4, label: "Node 4" },
  { id: 5, label: "Node 5" },
];
const defEdges: Edge[] = [
  { id: 1, from: 1, to: 3 },
  { id: 2, from: 1, to: 2 },
  { id: 3, from: 2, to: 4 },
  { id: 4, from: 2, to: 5 },
  { id: 5, from: 3, to: 3 },
];

const network = ref<{
  nodes: Node[];
  edges: Edge[];
  options: Options;
}>({
  nodes: [...defNodes],
  edges: [...defEdges],
  options: {
    nodes: {
      shape: "circle",
      size: 24,
      color: {
        border: "grey",
        highlight: {
          border: "black",
          background: "white",
        },
        hover: {
          border: "orange",
          background: "grey",
        },
      },
      font: { color: "black" },
      shapeProperties: {
        useBorderWithImage: true,
      },
    },
  },
});

const networkEvent = (...args: any[]) => {
  console.log(args);
};

const networkRef = ref();

onMounted(() => {
  const network = networkRef.value.network;
  // if you want access to vis.js network api
  console.log(network);
  // getNode(id) to get node
  console.log("getNode-1: ", networkRef.value.getNode(1));
  // getEdge(id) to get edge
  console.log("getEdge-1: ", networkRef.value.getEdge(1));
});
</script>

<template>
  <div>
    <vue-vis-network
      ref="networkRef"
      class="network"
      :nodes="network.nodes"
      :edges="network.edges"
      :options="network.options"
      @click="networkEvent('click',$event)"
      @double-click="networkEvent('doubleClick',$event)"
      @oncontext="networkEvent('oncontext',$event)"
      @hold="networkEvent('hold',$event)"
      @release="networkEvent('release',$event)"
      @select="networkEvent('select',$event)"
      @select-node="networkEvent('selectNode',$event)"
      @select-edge="networkEvent('selectEdge',$event)"
      @deselect-node="networkEvent('deselectNode',$event)"
      @deselect-edge="networkEvent('deselectEdge',$event)"
      @drag-start="networkEvent('dragStart',$event)"
      @dragging="networkEvent('dragging',$event)"
      @drag-end="networkEvent('dragEnd',$event)"
      @hover-node="networkEvent('hoverNode',$event)"
      @blur-node="networkEvent('blurNode',$event)"
      @hover-edge="networkEvent('hoverEdge',$event)"
      @blur-edge="networkEvent('blurEdge',$event)"
      @zoom="networkEvent('zoom',$event)"
      @show-popup="networkEvent('showPopup',$event)"
      @hide-popup="networkEvent('hidePopup',$event)"
      @start-stabilizing="networkEvent('startStabilizing',$event)"
      @stabilization-progress="networkEvent('stabilizationProgress',$event)"
      @stabilization-iterations-done="networkEvent('stabilizationIterationsDone',$event)"
      @stabilized="networkEvent('stabilized',$event)"
      @resize="networkEvent('resize',$event)"
      @init-redraw="networkEvent('initRedraw',$event)"
      @before-drawing="networkEvent('beforeDrawing', $event)"
      @after-drawing="networkEvent('afterDrawing',$event)"
      @animation-finished="networkEvent('animationFinished',$event)"
      @config-change="networkEvent('configChange',$event)"
      @nodes-mounted="networkEvent('nodes-mounted',$event)"
      @nodes-add="networkEvent('nodes-add',$event)"
      @nodes-update="networkEvent('nodes-update',$event)"
      @nodes-remove="networkEvent('nodes-remove',$event)"
      @edges-mounted="networkEvent('edges-mounted',$event)"
      @edges-add="networkEvent('edges-add',$event)"
      @edges-update="networkEvent('edges-update',$event)"
      @edges-remove="networkEvent('edges-remove',$event)"
    >
    </vue-vis-network>
  </div>
</template>

<style>
.network {
  height: 400px;
  border: 1px solid #ccc;
  margin: 5px 0;
}
</style>
```

## Events

### Component Events
By default all Vis-network events are emitted by your component. You can subscribe to a subset by passing an array in the prop `events` [Vis-network event](https://visjs.github.io/vis-network/docs/network/#Events).

```html
<body>
  <div id="app">
    <vue-vis-network 
      ref="network"
      :nodes="nodes"
      :edges="edges"
      :options="options"
      :events="['selectNode', 'hoverNode']"
      @select-node="onNodeSelected"
      @hover-node="onNodeHovered">
    </vue-vis-network>
  </div>
</body>
```

### Data Events

When you pass an Array of data object, it is converted internally as a DataSet.
An event with the DataSet object will be fired at mounted. It's name will be prepend with the prop name (Ex: `edges-mounted`, `nodes-mounted`). You could use it to interact with the DataSet.

All the [Visjs DataSet event](https://visjs.github.io/vis-data/data/dataset.html#Events) will be prepened the same fashion (`items-add`, `items-remove`, `items-update`). For example, pushing a new object to the `items` prop will fire a `items-add` event with the following payload:
```javascript
{
  event: 'add',
  properties: {
    items: [7],
  },
  senderId: null,
}
```

### Advanced

You can also manage your own data bindings by passing your own DataSet or DataView instead of an Array.

``` javascript
import { DataSet } from 'vue-vis-network';

new Vue({
  el: '#app',
  data() {
    return {
      nodes: new DataSet([
        {id: 1,  label: 'circle',  shape: 'circle' },
        {id: 2,  label: 'ellipse', shape: 'ellipse'},
        {id: 3,  label: 'database',shape: 'database'}
      ]),
      edges: new DataSet([
        {from: 1, to: 2},
        {from: 1, to: 3}
      ]),
      options: {
        nodes: {
          borderWidth: 4
         }
      }
    }
  },
});
```

## Vis-network documentation

For the full reference see: 
* [Network](https://visjs.github.io/vis-network/docs/network/)
* [DataSet](https://visjs.github.io/vis-data/data/dataset.html)
* [DataView](https://visjs.github.io/vis-data/data/dataview.html)