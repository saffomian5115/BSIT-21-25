import React from 'react';

const GastroCareLogo = ({ size = 38, showText = false, textSize = '1.4rem' }) => {
  const s = size;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={s} height={s * 1.1} viewBox="0 0 180 200" xmlns="http://www.w3.org/2000/svg">
        {/* Gold outer shield */}
        <path d="M90 2 L172 32 L172 112 Q172 164 90 188 Q8 164 8 112 L8 32 Z" fill="#c9a84c" stroke="#a07a30" strokeWidth="2"/>
        {/* Dark green inner shield */}
        <path d="M90 14 L160 40 L160 112 Q160 156 90 178 Q20 156 20 112 L20 40 Z" fill="#0a4f3c"/>
        {/* Teal glow layer */}
        <path d="M90 26 L148 48 L148 112 Q148 148 90 167 Q32 148 32 112 L32 48 Z" fill="#1a7a5e"/>
        {/* Stomach outline */}
        <path d="M63 80 Q51 68 56 85 Q46 102 61 116 Q76 130 90 125 Q104 130 119 116 Q134 102 124 85 Q129 68 117 80 Q105 62 90 65 Q75 62 63 80 Z"
          fill="none" stroke="#e8c97a" strokeWidth="4" strokeLinecap="round"/>
        {/* Heartbeat line */}
        <polyline points="60,100 71,100 78,83 86,117 94,83 102,117 109,100 120,100"
          fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {showText && (
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: textSize, fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>
          GastroCare
        </span>
      )}
    </span>
  );
};

export default GastroCareLogo;
