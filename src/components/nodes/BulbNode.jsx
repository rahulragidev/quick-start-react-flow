import { useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { gsap } from 'gsap';

export default function BulbNode({ data }) {
  const bulbRef = useRef(null);
  const shellRef = useRef(null);

  useEffect(() => {
    if (!bulbRef.current || !shellRef.current) return;
    gsap.killTweensOf([bulbRef.current, shellRef.current]);
    if (data?.value) {
      gsap.to(bulbRef.current, { background: '#fde68a', boxShadow: '0 0 24px 10px rgba(250, 204, 21, 0.8)', duration: 0.25 });
      gsap.to(shellRef.current, { borderColor: '#facc15', duration: 0.25 });
    } else {
      gsap.to(bulbRef.current, { background: '#374151', boxShadow: '0 0 0 0 rgba(0,0,0,0)', duration: 0.25 });
      gsap.to(shellRef.current, { borderColor: '#94a3b8', duration: 0.25 });
    }
  }, [data?.value]);

  return (
    <div ref={shellRef} style={{ padding: 12, border: '1px solid #94a3b8', borderRadius: 8, background: '#0f172a', color: 'white', minWidth: 140 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div ref={bulbRef} style={{ width: 18, height: 18, borderRadius: 9999, background: '#374151' }} />
        <span>BULB {data?.value ? 'ON' : 'OFF'}</span>
      </div>
      <Handle type="target" position={Position.Left} id="in" />
    </div>
  );
}


