import { useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function BufferNode({ data }) {
  const value = useMemo(() => Boolean(data?.value), [data?.value]);
  return (
    <div style={{ padding: 6, borderRadius: 6, background: 'transparent', color: 'white' }}>
      <svg width="80" height="50" viewBox="0 0 80 50">
        <path d="M10 10 L60 25 L10 40 Z" fill="#0f172a" stroke="#94a3b8"/>
      </svg>
      <Handle type="target" position={Position.Left} id="a" />
      <Handle type="source" position={Position.Right} id="out" style={{ background: value ? '#22c55e' : '#64748b' }} />
    </div>
  );
}


