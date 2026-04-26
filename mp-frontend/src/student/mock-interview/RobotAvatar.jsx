/**
 * RobotAvatar — 3D-style SVG robot face with animated mouth while speaking
 * Props:
 *   isSpeaking  {boolean} — animates the mouth open/close
 *   isListening {boolean} — shows mic/listening indicator
 */
export default function RobotAvatar({ isSpeaking = false, isListening = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>

      {/* Status label */}
      <div style={{
        fontSize: 11, fontWeight: 500, letterSpacing: "0.05em",
        padding: "4px 12px", borderRadius: 99,
        background: isSpeaking ? "#f0fdf4" : isListening ? "#eff6ff" : "#f9fafb",
        color: isSpeaking ? "#16a34a" : isListening ? "#2563eb" : "#9ca3af",
        border: isSpeaking
          ? "0.5px solid #bbf7d0"
          : isListening
          ? "0.5px solid #bfdbfe"
          : "0.5px solid #e5e7eb",
        transition: "all 0.3s ease",
      }}>
        {isSpeaking ? "● Speaking" : isListening ? "◉ Listening" : "○ Standby"}
      </div>

      {/* Robot SVG */}
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Head gradient for 3D look */}
          <radialGradient id="headGrad" cx="38%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="60%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>

          {/* Eye glow */}
          <radialGradient id="eyeGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </radialGradient>

          {/* Antenna glow */}
          <radialGradient id="antennaGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#10b981" />
          </radialGradient>

          {/* Cheek shine */}
          <radialGradient id="cheekGrad" cx="45%" cy="35%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Screen panel */}
          <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064e35" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>

          {isSpeaking && (
            <style>{`
              @keyframes mouthPulse {
                0%, 100% { d: path("M 55 107 Q 80 113 105 107"); }
                25%       { d: path("M 55 107 Q 80 120 105 107"); }
                75%       { d: path("M 55 107 Q 80 118 105 107"); }
              }
              @keyframes eyePulse {
                0%, 100% { opacity: 1; }
                50%       { opacity: 0.6; }
              }
              @keyframes antennaBlink {
                0%, 80%, 100% { opacity: 1; }
                90% { opacity: 0.2; }
              }
              @keyframes floatRobot {
                0%, 100% { transform: translateY(0px); }
                50%       { transform: translateY(-4px); }
              }
              @keyframes listenPulse {
                0%, 100% { r: 6; opacity: 0.9; }
                50%       { r: 9; opacity: 0.5; }
              }
            `}</style>
          )}
          {!isSpeaking && (
            <style>{`
              @keyframes floatRobot {
                0%, 100% { transform: translateY(0px); }
                50%       { transform: translateY(-3px); }
              }
              @keyframes antennaBlink {
                0%, 80%, 100% { opacity: 1; }
                90% { opacity: 0.2; }
              }
              @keyframes listenPulse {
                0%, 100% { r: 6; opacity: 0.9; }
                50%       { r: 9; opacity: 0.5; }
              }
            `}</style>
          )}
        </defs>

        {/* Floating group */}
        <g style={{ animation: "floatRobot 3s ease-in-out infinite" }}>

          {/* NECK */}
          <rect x="68" y="128" width="24" height="14" rx="4" fill="#059669" />
          <rect x="72" y="130" width="16" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
          <rect x="72" y="134" width="16" height="2" rx="1" fill="rgba(255,255,255,0.2)" />

          {/* HEAD BASE */}
          <rect x="22" y="40" width="116" height="92" rx="22" fill="url(#headGrad)" />

          {/* Head top highlight */}
          <ellipse cx="65" cy="46" rx="38" ry="10" fill="rgba(255,255,255,0.25)" />

          {/* Head side shadow */}
          <rect x="118" y="50" width="20" height="72" rx="12" fill="rgba(0,0,0,0.08)" />

          {/* ANTENNA BASE */}
          <rect x="76" y="28" width="8" height="16" rx="3" fill="#059669" />

          {/* ANTENNA BALL */}
          <circle cx="80" cy="23" r="10" fill="url(#antennaGrad)"
            style={{ animation: "antennaBlink 2s ease-in-out infinite" }} />
          <circle cx="77" cy="20" r="3" fill="rgba(255,255,255,0.7)" />

          {/* FACE PANEL */}
          <rect x="34" y="54" width="92" height="70" rx="14" fill="url(#panelGrad)" />
          <rect x="35" y="55" width="90" height="68" rx="13" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* LEFT EYE */}
          <rect x="44" y="66" width="28" height="22" rx="8" fill="#0f172a" />
          <rect x="45" y="67" width="26" height="20" rx="7" fill="#052e16" />
          <circle cx="58" cy="77" r="8" fill="url(#eyeGrad)"
            style={{ animation: isSpeaking ? "eyePulse 0.5s ease-in-out infinite" : "none" }} />
          <circle cx="58" cy="77" r="4" fill="#064e35" />
          <circle cx="55" cy="74" r="2" fill="rgba(255,255,255,0.9)" />
          <rect x="45" y="67" width="26" height="4" rx="3" fill="rgba(255,255,255,0.06)" />

          {/* RIGHT EYE */}
          <rect x="88" y="66" width="28" height="22" rx="8" fill="#0f172a" />
          <rect x="89" y="67" width="26" height="20" rx="7" fill="#052e16" />
          <circle cx="102" cy="77" r="8" fill="url(#eyeGrad)"
            style={{ animation: isSpeaking ? "eyePulse 0.5s ease-in-out infinite 0.25s" : "none" }} />
          <circle cx="102" cy="77" r="4" fill="#064e35" />
          <circle cx="99" cy="74" r="2" fill="rgba(255,255,255,0.9)" />
          <rect x="89" y="67" width="26" height="4" rx="3" fill="rgba(255,255,255,0.06)" />

          {/* NOSE */}
          <ellipse cx="80" cy="94" rx="4" ry="3" fill="rgba(255,255,255,0.12)" />

          {/* MOUTH AREA */}
          <rect x="50" y="100" width="60" height="18" rx="9" fill="#0f172a" />
          <rect x="51" y="101" width="58" height="16" rx="8" fill="#052e16" />

          {isSpeaking ? (
            <>
              <rect x="54" y="104" width="52" height="10" rx="5" fill="#065f46"
                style={{
                  transformOrigin: "80px 109px",
                  animation: "mouthOpen 0.4s ease-in-out infinite alternate",
                }}
              />
              <style>{`
                @keyframes mouthOpen {
                  from { transform: scaleY(0.3); }
                  to   { transform: scaleY(1); }
                }
              `}</style>
              {[58, 66, 74, 82, 90, 98].map((x, i) => (
                <rect key={i} x={x} y="103" width="6" height="5" rx="1.5" fill="rgba(255,255,255,0.7)" />
              ))}
            </>
          ) : (
            <path
              d="M 57 109 Q 80 116 103 109"
              stroke="#10b981" strokeWidth="2.5"
              strokeLinecap="round" fill="none"
            />
          )}

          {/* CHEEK BLUSH */}
          <ellipse cx="36" cy="92" rx="10" ry="7" fill="url(#cheekGrad)" />
          <ellipse cx="124" cy="92" rx="10" ry="7" fill="url(#cheekGrad)" />

          {/* SIDE EARS / BOLTS */}
          <circle cx="22" cy="82" r="8" fill="#059669" />
          <circle cx="22" cy="82" r="5" fill="#d1fae5" />
          <circle cx="22" cy="82" r="2" fill="#059669" />

          <circle cx="138" cy="82" r="8" fill="#059669" />
          <circle cx="138" cy="82" r="5" fill="#d1fae5" />
          <circle cx="138" cy="82" r="2" fill="#059669" />

          {/* LISTENING PULSE */}
          {isListening && (
            <>
              <circle cx="22" cy="82" r="6" fill="none" stroke="#3b82f6" strokeWidth="2"
                style={{ animation: "listenPulse 1s ease-in-out infinite" }} />
              <circle cx="138" cy="82" r="6" fill="none" stroke="#3b82f6" strokeWidth="2"
                style={{ animation: "listenPulse 1s ease-in-out infinite 0.5s" }} />
            </>
          )}

        </g>

        {/* SPEAKING SOUND WAVES */}
        {isSpeaking && (
          <g>
            {[0, 1, 2].map(i => (
              <path key={i}
                d={`M ${150 + i * 8} ${68 + i * 4} Q ${155 + i * 8} 80 ${150 + i * 8} ${92 - i * 4}`}
                fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"
                style={{ animation: `waveFade 0.8s ease-in-out infinite ${i * 0.2}s` }}
              />
            ))}
            <style>{`
              @keyframes waveFade {
                0%, 100% { opacity: 0.2; }
                50%       { opacity: 1; }
              }
            `}</style>
          </g>
        )}
      </svg>
    </div>
  );
}