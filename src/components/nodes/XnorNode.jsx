import { useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function XnorNode({ data }) {
  const value = useMemo(() => Boolean(data?.value), [data?.value]);
  return (
    <div style={{ padding: 6, borderRadius: 6, background: 'transparent', color: 'white' }}>
      <svg width="100" height="50" viewBox="0 0 100 50">
        <path d="M18 10 C36 10, 41 10, 51 25 C41 40, 36 40, 18 40 Z" fill="#0f172a" stroke="#94a3b8"/>
        <path d="M14 10 C32 10, 37 10, 47 25 C37 40, 32 40, 14 40 Z" fill="none" stroke="#94a3b8"/>
        <circle cx="66" cy="25" r="5" fill="#0f172a" stroke="#94a3b8" />
      </svg>
      <Handle type="target" position={Position.Left} id="a" style={{ top: 16 }} />
      <Handle type="target" position={Position.Left} id="b" style={{ bottom: 16 }} />
      <Handle type="source" position={Position.Right} id="out" style={{ background: value ? '#22c55e' : '#64748b' }} />
    </div>
  );
}


