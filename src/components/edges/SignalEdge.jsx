import { useEffect, useRef } from 'react';
import { BaseEdge, getStraightPath } from '@xyflow/react';
import { gsap } from 'gsap';

export default function SignalEdge({ id, sourceX, sourceY, targetX, targetY, data }) {
  const markerRef = useRef(null);
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  useEffect(() => {
    if (!markerRef.current) return;
    gsap.killTweensOf(markerRef.current);
    const len = markerRef.current.getTotalLength?.() ?? 100;
    const timeline = gsap.timeline({ repeat: -1 });
    if (data?.active) {
      timeline.fromTo(markerRef.current, { strokeDasharray: `0 ${len}` }, { strokeDasharray: `${len} ${len}`, duration: 0.6, ease: 'none' });
    }
    return () => timeline.kill();
  }, [data?.active]);

  return (
    <g>
      <BaseEdge id={id} path={edgePath} style={{ stroke: data?.active ? '#22c55e' : '#64748b', strokeWidth: 2 }} />
      <path ref={markerRef} d={edgePath} stroke="#22c55e" strokeWidth="2" fill="none" />
    </g>
  );
}


