import { useEffect, useMemo, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { gsap } from 'gsap';

export default function NotNode({ data }) {
  const ref = useRef(null);
  const value = useMemo(() => Boolean(data?.value), [data?.value]);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { borderColor: value ? '#22c55e' : '#94a3b8', duration: 0.2 });
  }, [value]);

  return (
    <div ref={ref} style={{ padding: 8, border: '1px solid #94a3b8', borderRadius: 8, background: '#0f172a', color: 'white' }}>
      <svg width="80" height="50" viewBox="0 0 80 50">
        <path d="M10 10 L45 25 L10 40 Z" fill="#0f172a" stroke="#94a3b8"/>
        <circle cx="52" cy="25" r="5" fill="#0f172a" stroke="#94a3b8" />
        <text x="18" y="29" fill="#94a3b8" fontSize="10">NOT</text>
      </svg>
      <Handle type="target" position={Position.Left} id="a" />
      <Handle type="source" position={Position.Right} id="out" style={{ background: value ? '#22c55e' : '#64748b' }} />
    </div>
  );
}


