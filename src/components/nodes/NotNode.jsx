import { useEffect, useMemo, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { gsap } from 'gsap';

export default function NotNode({ data }) {
  const ref = useRef(null);
  const value = useMemo(() => !Boolean(data?.a), [data?.a]);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { borderColor: value ? '#22c55e' : '#94a3b8', duration: 0.2 });
  }, [value]);

  return (
    <div ref={ref} style={{ padding: 10, border: '1px solid #94a3b8', borderRadius: 8, background: '#0f172a', color: 'white', minWidth: 140 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>NOT</span>
        <span>{value ? '1' : '0'}</span>
      </div>
      <Handle type="target" position={Position.Left} id="a" />
      <Handle type="source" position={Position.Right} id="out" style={{ background: value ? '#22c55e' : '#64748b' }} />
    </div>
  );
}


