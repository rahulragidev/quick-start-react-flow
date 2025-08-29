import { useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function XorNode({ data }) {
  const value = useMemo(() => Boolean(data?.value), [data?.value]);
  return (
    <div style={{ padding: 6, borderRadius: 6, background: 'transparent', color: 'white' }}>
      <svg width="95" height="50" viewBox="0 0 95 50">
        <path d="M12 10 C30 10, 35 10, 45 25 C35 40, 30 40, 12 40 Z" fill="#0f172a" stroke="#94a3b8"/>
        <path d="M8 10 C26 10, 31 10, 41 25 C31 40, 26 40, 8 40 Z" fill="none" stroke="#94a3b8"/>
      </svg>
      <Handle type="target" position={Position.Left} id="a" style={{ top: 16 }} />
      <Handle type="target" position={Position.Left} id="b" style={{ bottom: 16 }} />
      <Handle type="source" position={Position.Right} id="out" style={{ background: value ? '#22c55e' : '#64748b' }} />
    </div>
  );
}


