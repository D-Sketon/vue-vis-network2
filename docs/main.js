const { createApp, ref, reactive, nextTick, onMounted, watch } = Vue;

const defaultCode = `// Define nodes
const nodes = [
  { id: 1, label: "Node 1", color: "#3b82f6" },
  { id: 2, label: "Node 2", color: "#10b981" },
  { id: 3, label: "Node 3", color: "#f59e0b" },
  { id: 4, label: "Node 4", color: "#ef4444" },
  { id: 5, label: "Node 5", color: "#06b6d4" },
];

// Define edges
const edges = [
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 3 },
];

// Define options
const options = {
  nodes: {
    shape: "dot",
    size: 20,
    font: {
      size: 14,
      face: "Inter",
    },
    borderWidth: 2,
    shadow: true,
  },
  edges: {
    width: 2,
    shadow: true,
    color: {
      color: "#94a3b8",
      highlight: "#0d9488",
      hover: "#0f766e",
    },
    smooth: {
      type: "continuous",
    },
  },
  physics: {
    forceAtlas2Based: {
      gravitationalConstant: -26,
      centralGravity: 0.005,
      springLength: 230,
      springConstant: 0.18,
    },
    maxVelocity: 146,
    solver: "forceAtlas2Based",
    timestep: 0.35,
    stabilization: { iterations: 150 },
  },
  interaction: {
    hover: true,
    tooltipDelay: 200,
  },
  autoResize: true,
};

// Must return an object with nodes, edges, and options
return { nodes, edges, options };`;

const App = {
  components: {
    // Accessing the named export 'VueVisNetwork' from the global object
    VisNetwork: window.VueVisNetwork.VueVisNetwork,
  },
  setup() {
    const activeTab = ref("controls");
    const nodes = ref([]);
    const edges = ref([]);
    const options = reactive({});
    const codeError = ref("");
    let editor = null;

    const logs = ref([]);
    const selectedNode = ref(null);
    const networkRef = ref(null);
    const logContainer = ref(null);

    const addLog = (event) => {
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
      });
      logs.value.push({ time, event });
      if (logs.value.length > 50) logs.value.shift();

      nextTick(() => {
        if (logContainer.value) {
          logContainer.value.scrollTop = logContainer.value.scrollHeight;
        }
      });
    };

    const runCode = () => {
      codeError.value = "";
      try {
        const code = editor ? editor.getValue() : defaultCode;
        // Create a function from the code string
        const func = new Function(code);
        const result = func();

        if (!result || !result.nodes || !result.edges || !result.options) {
          throw new Error("Code must return an object with nodes, edges, and options properties.");
        }

        nodes.value = result.nodes;
        edges.value = result.edges;
        
        // Update options reactively
        // Clear existing options
        for (const key in options) {
            delete options[key];
        }
        // Assign new options
        Object.assign(options, result.options);
        
        // Ensure interaction hover is correct for mobile
        if (window.innerWidth <= 768 && options.interaction) {
           options.interaction.hover = false;
        }

        addLog("Code executed successfully");
      } catch (e) {
        console.error(e);
        codeError.value = e.message;
        addLog(`Error: ${e.message}`);
      }
    };

    onMounted(() => {
      editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
        mode: "javascript",
        theme: "nord",
        lineNumbers: true,
        tabSize: 2,
      });
      editor.setValue(defaultCode);
      
      // Initial run
      runCode();
    });

    watch(activeTab, (newTab) => {
      if (newTab === "code" && editor) {
        nextTick(() => {
          editor.refresh();
        });
      }
    });

    // Update hover option on resize
    window.addEventListener("resize", () => {
      if (options.interaction) {
        options.interaction.hover = window.innerWidth > 768;
      }
    });

    const addNode = () => {
      const id =
        nodes.value.length > 0
          ? Math.max(...nodes.value.map((n) => n.id)) + 1
          : 1;
      const colors = [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#06b6d4",
        "#84cc16",
        "#f97316",
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      nodes.value.push({
        id,
        label: `Node ${id}`,
        color: color,
      });
      addLog(`Added Node ${id}`);
    };

    const addEdge = () => {
      if (nodes.value.length < 2) return;
      const from =
        nodes.value[Math.floor(Math.random() * nodes.value.length)].id;
      const to = nodes.value[Math.floor(Math.random() * nodes.value.length)].id;

      // Avoid duplicates for this demo
      const exists = edges.value.some((e) => e.from === from && e.to === to);
      if (!exists) {
        edges.value.push({ from, to });
        addLog(`Added Edge ${from} -> ${to}`);
      } else {
        addLog(`Edge ${from} -> ${to} already exists`);
      }
    };

    const resetNetwork = () => {
      // Re-run the code to reset to initial state defined in editor
      runCode();
      selectedNode.value = null;
      addLog("Network Reset");
    };

    const onClick = (params) => {
      // Only log if clicking on empty space
      if (params.nodes.length === 0 && params.edges.length === 0) {
        addLog("Clicked on canvas");
      }
    };

    const onSelectNode = (params) => {
      if (params.nodes.length > 0) {
        selectedNode.value = params.nodes[0];
        addLog(`Selected Node: ${params.nodes[0]}`);
      }
    };

    const onDeselectNode = (params) => {
      selectedNode.value = null;
      addLog("Deselected Node");
    };

    const onHoverNode = (params) => {
      addLog(`Hover Node: ${params.node}`);
    };
    const onBlurNode = (params) => addLog(`Blur Node: ${params.node}`);
    const onHoverEdge = (params) => addLog(`Hover Edge: ${params.edge}`);
    const onBlurEdge = (params) => addLog(`Blur Edge: ${params.edge}`);

    const onDoubleClick = (params) => addLog("Double Click");
    const onContext = (params) => addLog("Context Menu");
    const onHold = (params) => addLog("Hold");
    const onRelease = (params) => addLog("Release");
    const onSelectEdge = (params) =>
      addLog(`Selected Edge: ${params.edges[0]}`);
    const onDeselectEdge = (params) => addLog("Deselected Edge");
    const onDragStart = (params) => addLog("Drag Start");
    const onDragEnd = (params) => addLog("Drag End");
    const onZoom = (params) => addLog(`Zoom: ${params.scale.toFixed(2)}`);
    const onStabilized = (params) =>
      addLog(`Stabilized (${params.iterations} iterations)`);

    return {
      activeTab,
      codeError,
      runCode,
      nodes,
      edges,
      options,
      logs,
      selectedNode,
      addNode,
      addEdge,
      resetNetwork,
      onClick,
      onSelectNode,
      onDeselectNode,
      onHoverNode,
      onBlurNode,
      onHoverEdge,
      onBlurEdge,
      onDoubleClick,
      onContext,
      onHold,
      onRelease,
      onSelectEdge,
      onDeselectEdge,
      onDragStart,
      onDragEnd,
      onZoom,
      onStabilized,
      networkRef,
      logContainer,
    };
  },
};

createApp(App).mount("#app");
