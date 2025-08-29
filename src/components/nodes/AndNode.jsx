import { useEffect, useMemo, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { gsap } from 'gsap';

export default function AndNode({ data }) {
  const ref = useRef(null);
  const value = useMemo(() => Boolean(data?.value), [data?.value]);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { borderColor: value ? '#22c55e' : '#94a3b8', duration: 0.2 });
  }, [value]);

  return (
    <div ref={ref} style={{ padding: 8, border: '1px solid #94a3b8', borderRadius: 8, background: '#0f172a', color: 'white' }}>
      <svg width="80" height="50" viewBox="0 0 80 50">
        <path d="M10 10 H40 A15 15 0 0 1 40 40 H10 Z" fill="#0f172a" stroke="#94a3b8"/>
        <text x="27" y="29" fill="#94a3b8" fontSize="10">AND</text>
      </svg>
      <Handle type="target" position={Position.Left} id="a" style={{ top: 16 }} />
      <Handle type="target" position={Position.Left} id="b" style={{ bottom: 16 }} />
      <Handle type="source" position={Position.Right} id="out" style={{ background: value ? '#22c55e' : '#64748b' }} />
    </div>
  );
}


