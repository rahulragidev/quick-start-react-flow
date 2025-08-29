import { addEdge, BackgroundVariant, Handle, Position } from '@xyflow/react';
import { ReactFlow, Controls,Background, applyNodeChanges, applyEdgeChanges, MiniMap, useReactFlow, ReactFlowProvider } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useState, useCallback } from 'react';
import { TextUpdaterNode } from './components/TextUpdaterNode';
import InputNode from './components/nodes/InputNode';
import OutputNode from './components/nodes/OutputNode';
import AndNode from './components/nodes/AndNode';
import OrNode from './components/nodes/OrNode';
import NotNode from './components/nodes/NotNode';
import SignalEdge from './components/edges/SignalEdge';

//initial nodes and edges
const initialNodes = [
  {
    id: 'in1',
    position: { x: -400, y: -100 },
    type: 'inputNode',
    data: { value: true },
  },
  {
    id: 'in2',
    position: { x: -400, y: 50 },
    type: 'inputNode',
    data: { value: false },
  },
  {
    id: 'and1',
    position: { x: -150, y: -25 },
    type: 'andNode',
    data: {},
  },
  {
    id: 'not1',
    position: { x: 80, y: -25 },
    type: 'notNode',
    data: {},
  },
  {
    id: 'out1',
    position: { x: 300, y: -25 },
    type: 'outputNode',
    data: {},
  },
];

const initialEdges = [
  { id: 'in1-and1', source: 'in1', sourceHandle: 'out', target: 'and1', targetHandle: 'a', type: 'signalEdge' },
  { id: 'in2-and1', source: 'in2', sourceHandle: 'out', target: 'and1', targetHandle: 'b', type: 'signalEdge' },
  { id: 'and1-not1', source: 'and1', sourceHandle: 'out', target: 'not1', targetHandle: 'a', type: 'signalEdge' },
  { id: 'not1-out1', source: 'not1', sourceHandle: 'out', target: 'out1', targetHandle: 'in', type: 'signalEdge' },
];
 
const nodeTypes = {
  textUpdater: TextUpdaterNode,
  inputNode: InputNode,
  outputNode: OutputNode,
  andNode: AndNode,
  orNode: OrNode,
  notNode: NotNode,
};
const edgeTypes = { signalEdge: SignalEdge };

function FlowCanvas({ nodes, setNodes, edges, setEdges }) {
  console.log("Entered FlowCanvas,");
  //get the screen to flow position using the useReactFlow hook
  const { screenToFlowPosition } = useReactFlow();
  //state to store the connecting
  const [connecting, setConnecting] = useState(null);

  //event handlers for nodes and edges while dragging, resizing, etc.
  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [setEdges],
  );

  // Event handler for the 'connecting nodes' function to create a new edge and update the edge Array.
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges],
  );
//event handler for the start of the connection
  const onConnectStart = useCallback((event, params) => {
    setConnecting(params);
  }, []);

  //event handler for the end of the connection to create a new node and update the node Array.
  const onConnectEnd = useCallback(
    (event) => {

      if(!connecting){
        return;
      };
      //get position using the screenToFlowPosition function for the new node
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        console.log(position);
        if(!position){
          return;
        };
        //create a new node id
        const newNodeId = `n-${Date.now()}`;

        setNodes((nodesSnapshot) => nodesSnapshot.concat({
          id: newNodeId,
          position,
          data: { label: 'New Node' }
        }));

        //create a new edge id
        setEdges((edgesSnapshot) => addEdge({
          id: `${connecting.nodeId}-${newNodeId}`,
          source: connecting.nodeId,
          sourceHandle: connecting.handleId,
          target: newNodeId,
          type: 'smoothstep',
        }, edgesSnapshot));
        //reset the connecting state
      setConnecting(null);
    },
    [connecting, screenToFlowPosition, setNodes, setEdges]
  );

  return (
    <ReactFlow 
      nodes={nodes} 
      edges={edges} 
      onNodesChange={onNodesChange} 
      onEdgesChange={onEdgesChange} 
      onConnect={onConnect} 
      onConnectStart={onConnectStart} 
      onConnectEnd={onConnectEnd} 
      panOnDrag={true}
      panOnScroll={true}
      zoomOnScroll={true}
      zoomOnPinch={true}
      selectionOnDrag={true} 
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitViewOptions={{ padding: 0.1 }}
      minZoom={0.1}
      maxZoom={2.5}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      <Controls showInteractive={true} />
      <MiniMap pannable zoomable/>
    </ReactFlow>
  );
}

export default function App() {
  //initial state of nodes and edges
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // propagate logic values through edges
  const evaluateGraph = useCallback(() => {
    const nodeIdToValue = new Map();
    nodes.forEach((n) => {
      if (n.type === 'inputNode') nodeIdToValue.set(n.id, { out: Boolean(n.data?.value) });
    });

    // simple multi-pass to settle values
    for (let i = 0; i < 3; i++) {
      nodes.forEach((n) => {
        if (n.type === 'andNode') {
          const a = edges.find((e) => e.target === n.id && e.targetHandle === 'a');
          const b = edges.find((e) => e.target === n.id && e.targetHandle === 'b');
          const av = a ? nodeIdToValue.get(a.source)?.out : undefined;
          const bv = b ? nodeIdToValue.get(b.source)?.out : undefined;
          const out = Boolean(av) && Boolean(bv);
          nodeIdToValue.set(n.id, { out });
        }
        if (n.type === 'orNode') {
          const a = edges.find((e) => e.target === n.id && e.targetHandle === 'a');
          const b = edges.find((e) => e.target === n.id && e.targetHandle === 'b');
          const av = a ? nodeIdToValue.get(a.source)?.out : undefined;
          const bv = b ? nodeIdToValue.get(b.source)?.out : undefined;
          const out = Boolean(av) || Boolean(bv);
          nodeIdToValue.set(n.id, { out });
        }
        if (n.type === 'notNode') {
          const a = edges.find((e) => e.target === n.id && e.targetHandle === 'a');
          const av = a ? nodeIdToValue.get(a.source)?.out : undefined;
          const out = !Boolean(av);
          nodeIdToValue.set(n.id, { out });
        }
        if (n.type === 'outputNode') {
          const a = edges.find((e) => e.target === n.id && e.targetHandle === 'in');
          const av = a ? nodeIdToValue.get(a.source)?.out : undefined;
          nodeIdToValue.set(n.id, { in: Boolean(av) });
        }
      });
    }

    // update node data and edge activity
    setNodes((prev) => prev.map((n) => {
      if (n.type === 'inputNode') return n;
      if (n.type === 'outputNode') return { ...n, data: { ...n.data, value: nodeIdToValue.get(n.id)?.in } };
      return { ...n, data: { ...n.data, a: undefined, b: undefined, value: nodeIdToValue.get(n.id)?.out } };
    }));
    setEdges((prev) => prev.map((e) => ({ ...e, type: 'signalEdge', data: { active: Boolean(nodeIdToValue.get(e.source)?.out) } })));
  }, [nodes, edges, setNodes, setEdges]);

  // re-evaluate when graph changes
  useEffect(() => {
    evaluateGraph();
  }, [nodes, edges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <FlowCanvas nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
      </ReactFlowProvider>
    </div>
  );
}