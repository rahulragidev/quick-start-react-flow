import { addEdge, BackgroundVariant } from '@xyflow/react';
import { ReactFlow, Controls,Background, applyNodeChanges, applyEdgeChanges, MiniMap, useReactFlow, ReactFlowProvider } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useState, useCallback } from 'react';
import { TextUpdaterNode } from './components/TextUpdaterNode';

//initial nodes and edges
const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'textUpdater',
  },
  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
  },
];

const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
    type: 'smoothstep',
    animated: true,
    label: 'connects with',
  },
];
 
const nodeTypes = {
  textUpdater: TextUpdaterNode,
};

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
    panOnDrag={false} 
    panOnScroll={true} 
    selectionOnDrag={true} 
    nodeTypes={nodeTypes}>
      <Background />
      <Controls />
      <MiniMap pannable zoomable/>
    </ReactFlow>
  );
}

export default function App() {
  //initial state of nodes and edges
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <FlowCanvas nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
      </ReactFlowProvider>
    </div>
  );
}