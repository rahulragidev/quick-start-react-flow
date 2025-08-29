import { addEdge, BackgroundVariant, Handle, Position } from '@xyflow/react';
import { ReactFlow, Controls,Background, applyNodeChanges, applyEdgeChanges, MiniMap, useReactFlow, ReactFlowProvider } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useState, useCallback, useEffect } from 'react';
import { TextUpdaterNode } from './components/TextUpdaterNode';
import InputNode from './components/nodes/InputNode';
import OutputNode from './components/nodes/OutputNode';
import AndNode from './components/nodes/AndNode';
import OrNode from './components/nodes/OrNode';
import NotNode from './components/nodes/NotNode';
import BulbNode from './components/nodes/BulbNode';
import BufferNode from './components/nodes/BufferNode';
import NandNode from './components/nodes/NandNode';
import NorNode from './components/nodes/NorNode';
import XorNode from './components/nodes/XorNode';
import XnorNode from './components/nodes/XnorNode';
import ClockNode from './components/nodes/ClockNode';
import DFlipFlopNode from './components/nodes/DFlipFlopNode';
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
    type: 'bulbNode',
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
  bulbNode: BulbNode,
  bufferNode: BufferNode,
  nandNode: NandNode,
  norNode: NorNode,
  xorNode: XorNode,
  xnorNode: XnorNode,
  clockNode: ClockNode,
  dffNode: DFlipFlopNode,
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
    (params) => setEdges((edgesSnapshot) => {
      // only one connection per target handle
      const existsAtHandle = edgesSnapshot.some((e) => e.target === params.target && e.targetHandle === params.targetHandle);
      if (existsAtHandle) return edgesSnapshot;
      return addEdge({ ...params, type: 'signalEdge' }, edgesSnapshot);
    }),
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

  // toggle handler injected into input nodes
  const toggleInput = useCallback((id) => {
    setNodes((prev) => prev.map((n) => n.id === id && n.type === 'inputNode'
      ? { ...n, data: { ...n.data, value: !n.data?.value } }
      : n
    ));
  }, [setNodes]);

  // compute deterministic values and set edge activity
  const evaluateGraph = useCallback(() => {
    const nodeIdToValue = new Map();
    nodes.forEach((n) => {
      if (n.type === 'inputNode' || n.type === 'clockNode') nodeIdToValue.set(n.id, { out: Boolean(n.data?.value) });
    });

    // incoming edges index
    const incoming = new Map();
    nodes.forEach((n) => incoming.set(n.id, []));
    edges.forEach((e) => { (incoming.get(e.target) || []).push(e); });

    // settle values over a few passes
    for (let i = 0; i < 5; i++) {
      nodes.forEach((n) => {
        const inc = incoming.get(n.id) || [];
        const getVal = (handleId) => {
          const edge = inc.find((e) => e.targetHandle === handleId);
          return edge ? nodeIdToValue.get(edge.source)?.out : undefined;
        };

        if (n.type === 'andNode') nodeIdToValue.set(n.id, { out: Boolean(getVal('a')) && Boolean(getVal('b')) });
        if (n.type === 'orNode') nodeIdToValue.set(n.id, { out: Boolean(getVal('a')) || Boolean(getVal('b')) });
        if (n.type === 'notNode') nodeIdToValue.set(n.id, { out: !getVal('a') });
        if (n.type === 'bufferNode') nodeIdToValue.set(n.id, { out: Boolean(getVal('a')) });
        if (n.type === 'nandNode') nodeIdToValue.set(n.id, { out: !(Boolean(getVal('a')) && Boolean(getVal('b'))) });
        if (n.type === 'norNode') nodeIdToValue.set(n.id, { out: !(Boolean(getVal('a')) || Boolean(getVal('b'))) });
        if (n.type === 'xorNode') nodeIdToValue.set(n.id, { out: Boolean(getVal('a')) !== Boolean(getVal('b')) });
        if (n.type === 'xnorNode') nodeIdToValue.set(n.id, { out: Boolean(getVal('a')) === Boolean(getVal('b')) });
        if (n.type === 'dffNode') {
          const d = Boolean(getVal('d'));
          const clk = Boolean(getVal('clk'));
          const prevQ = Boolean(n.data?.q);
          const q = clk ? d : prevQ; // rising-true latch (simplified)
          nodeIdToValue.set(n.id, { q });
        }
        if (n.type === 'outputNode' || n.type === 'bulbNode') nodeIdToValue.set(n.id, { in: Boolean(getVal('in')) });
      });
    }

    setNodes((prev) => prev.map((n) => {
      if (n.type === 'inputNode') return { ...n, data: { ...n.data, onToggle: toggleInput } };
      if (n.type === 'clockNode') return { ...n, data: { ...n.data, onToggle: (id) => setNodes((p) => p.map((m) => m.id === id ? { ...m, data: { ...m.data, running: !m.data?.running } } : m )), onTick: (id) => setNodes((p) => p.map((m) => m.id === id ? { ...m, data: { ...m.data, value: !m.data?.value } } : m )) } };
      if (n.type === 'outputNode' || n.type === 'bulbNode') return { ...n, data: { ...n.data, value: nodeIdToValue.get(n.id)?.in } };
      if (n.type === 'dffNode') return { ...n, data: { ...n.data, q: nodeIdToValue.get(n.id)?.q } };
      return { ...n, data: { ...n.data, value: nodeIdToValue.get(n.id)?.out } };
    }));
    setEdges((prev) => prev.map((e) => ({ ...e, type: 'signalEdge', data: { active: Boolean(nodeIdToValue.get(e.source)?.out) } })));
  }, [nodes, edges, toggleInput]);

  // re-evaluate when graph changes
  useEffect(() => {
    evaluateGraph();
  }, [nodes, edges]);

  // persistence
  useEffect(() => {
    try {
      localStorage.setItem('rf:nodes', JSON.stringify(nodes));
      localStorage.setItem('rf:edges', JSON.stringify(edges));
    } catch {}
  }, [nodes, edges]);

  useEffect(() => {
    try {
      const n = JSON.parse(localStorage.getItem('rf:nodes'));
      const e = JSON.parse(localStorage.getItem('rf:edges'));
      if (Array.isArray(n) && Array.isArray(e)) {
        setNodes(n);
        setEdges(e);
      }
    } catch {}
     
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <FlowCanvas nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
        <div style={{ position: 'fixed', top: 12, left: 12, display: 'flex', gap: 8, zIndex: 10 }}>
          <Toolbar setNodes={setNodes} setEdges={setEdges} />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

function Toolbar({ setNodes, setEdges }) {
  const { screenToFlowPosition } = useReactFlow();
  const add = (type) => {
    const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const id = `${type}-${Date.now()}`;
    setNodes((prev) => prev.concat({ id, type, position: center, data: type === 'inputNode' ? { value: false } : {} }));
  };
  const save = () => {
    try {
      localStorage.setItem('rf:nodes', JSON.stringify(nodes));
      localStorage.setItem('rf:edges', JSON.stringify(edges));
    } catch {}
  };
  const load = () => {
    try {
      const n = JSON.parse(localStorage.getItem('rf:nodes'));
      const e = JSON.parse(localStorage.getItem('rf:edges'));
      if (Array.isArray(n)) setNodes(n);
      if (Array.isArray(e)) setEdges(e);
    } catch {}
  };
  const reset = () => { setNodes(initialNodes); setEdges(initialEdges); };
  const btn = (label, type) => (
    <button onClick={() => add(type)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #475569', background: '#0b1220', color: 'white' }}>{label}</button>
  );
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {btn('Input', 'inputNode')}
      {btn('AND', 'andNode')}
      {btn('OR', 'orNode')}
      {btn('NOT', 'notNode')}
      {btn('BUF', 'bufferNode')}
      {btn('NAND', 'nandNode')}
      {btn('NOR', 'norNode')}
      {btn('XOR', 'xorNode')}
      {btn('XNOR', 'xnorNode')}
      {btn('Clock', 'clockNode')}
      {btn('DFF', 'dffNode')}
      {btn('Bulb', 'bulbNode')}
      <button onClick={save} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #475569', background: '#0b1220', color: 'white' }}>Save</button>
      <button onClick={load} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #475569', background: '#0b1220', color: 'white' }}>Load</button>
      <button onClick={reset} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #7f1d1d', background: '#1b0b0b', color: 'white' }}>Reset</button>
    </div>
  );
}