import { useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function NandNode({ data }) {
  const value = useMemo(() => Boolean(data?.value), [data?.value]);
  return (
    <div style={{ padding: 6, borderRadius: 6, background: 'transparent', color: 'white' }}>
      <svg width="90" height="50" viewBox="0 0 90 50">
        <path d="M10 10 H45 A15 15 0 0 1 45 40 H10 Z" fill="#0f172a" stroke="#94a3b8"/>
        <circle cx="60" cy="25" r="5" fill="#0f172a" stroke="#94a3b8" />
      </svg>
      <Handle type="target" position={Position.Left} id="a" style={{ top: 16 }} />
      <Handle type="target" position={Position.Left} id="b" style={{ bottom: 16 }} />
      <Handle type="source" position={Position.Right} id="out" style={{ background: value ? '#22c55e' : '#64748b' }} />
    </div>
  );
}


