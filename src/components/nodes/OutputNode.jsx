import { useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { gsap } from 'gsap';

export default function OutputNode({ data }) {
  const circleRef = useRef(null);

  useEffect(() => {
    if (!circleRef.current) return;
    gsap.killTweensOf(circleRef.current);
    if (data?.value) {
      gsap.to(circleRef.current, { scale: 1.15, backgroundColor: '#22c55e', duration: 0.25 });
    } else {
      gsap.to(circleRef.current, { scale: 1, backgroundColor: '#64748b', duration: 0.25 });
    }
  }, [data?.value]);

  return (
    <div style={{ padding: 10, border: '1px solid #94a3b8', borderRadius: 8, background: '#0f172a', color: 'white', minWidth: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div ref={circleRef} style={{ width: 12, height: 12, borderRadius: 9999, background: '#64748b' }} />
        <span>OUTPUT {String(Boolean(data?.value)).toUpperCase()}</span>
      </div>
      <Handle type="target" position={Position.Left} id="in" style={{ background: data?.value ? '#22c55e' : '#64748b', width: 12, height: 12 }} />
    </div>
  );
}


