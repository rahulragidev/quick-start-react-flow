import { useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { gsap } from 'gsap';

export default function InputNode({ data, id }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.killTweensOf(containerRef.current);
    if (data?.value) {
      gsap.to(containerRef.current, { boxShadow: '0 0 16px 4px #22c55e', duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    } else {
      gsap.to(containerRef.current, { boxShadow: '0 0 0 0 rgba(0,0,0,0)', duration: 0.2 });
    }
  }, [data?.value]);

  return (
    <div ref={containerRef} style={{ padding: 10, border: '1px solid #94a3b8', borderRadius: 8, background: '#0f172a', color: 'white', minWidth: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span>INPUT</span>
        <button className="nodrag" onClick={() => data?.onToggle?.(id)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #475569', background: data?.value ? '#16a34a' : '#1f2937', color: 'white', cursor: 'pointer' }}>
          {data?.value ? 'ON' : 'OFF'}
        </button>
      </div>
      <Handle type="source" position={Position.Right} id="out" style={{ background: data?.value ? '#22c55e' : '#64748b', width: 12, height: 12 }} />
    </div>
  );
}


