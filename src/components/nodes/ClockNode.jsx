import { useEffect, useMemo, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { gsap } from 'gsap';

export default function ClockNode({ data, id }) {
  const tick = Boolean(data?.running);
  const intervalMs = data?.interval ?? 800;
  const dotRef = useRef(null);

  useEffect(() => {
    let int;
    if (tick) {
      int = setInterval(() => data?.onTick?.(id), intervalMs);
    }
    return () => clearInterval(int);
  }, [tick, intervalMs, id, data]);

  const value = useMemo(() => Boolean(data?.value), [data?.value]);
  useEffect(() => {
    if (!dotRef.current) return;
    gsap.to(dotRef.current, { background: value ? '#22c55e' : '#64748b', duration: 0.1 });
  }, [value]);

  return (
    <div style={{ padding: 8, border: '1px solid #94a3b8', borderRadius: 8, background: '#0f172a', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div ref={dotRef} style={{ width: 10, height: 10, borderRadius: 9999, background: '#64748b' }} />
        <button className="nodrag" onClick={() => data?.onToggle?.(id)} style={{ padding: '2px 6px', borderRadius: 6, border: '1px solid #475569', background: tick ? '#16a34a' : '#1f2937', color: 'white' }}>{tick ? 'Running' : 'Stopped'}</button>
      </div>
      <svg width="80" height="36" viewBox="0 0 80 36">
        <polyline points="5,30 15,30 15,10 25,10 25,30 35,30 35,10 45,10 45,30 55,30 55,10 65,10 65,30 75,30" fill="none" stroke="#94a3b8"/>
      </svg>
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
}


