import { useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function DFlipFlopNode({ data }) {
  const q = useMemo(() => Boolean(data?.q), [data?.q]);
  return (
    <div style={{ padding: 6, borderRadius: 6, background: 'transparent', color: 'white' }}>
      <svg width="120" height="70" viewBox="0 0 120 70">
        <rect x="10" y="10" width="90" height="50" fill="#0f172a" stroke="#94a3b8"/>
        <text x="22" y="32" fill="#94a3b8" fontSize="12">D</text>
        <polygon points="90,35 100,30 100,40" fill="#94a3b8" />
        <text x="78" y="32" fill="#94a3b8" fontSize="12">Q</text>
      </svg>
      <Handle type="target" position={Position.Left} id="d" style={{ top: 22 }} />
      <Handle type="target" position={Position.Left} id="clk" style={{ bottom: 22 }} />
      <Handle type="source" position={Position.Right} id="q" style={{ background: q ? '#22c55e' : '#64748b' }} />
    </div>
  );
}


