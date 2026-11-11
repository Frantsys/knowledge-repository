export default function LoadingScreen() {
  return (
    <div className="ls-wrap" role="status" aria-live="polite" aria-label="Carregando">
      <div className="ls-glow" aria-hidden="true" />

      <div className="ls-content">
        <div className="ls-book" aria-hidden="true">
          <div className="ls-cover" />
          <div className="ls-page ls-left" />
          <div className="ls-page ls-flip ls-f1" />
          <div className="ls-page ls-flip ls-f2" />
          <div className="ls-page ls-flip ls-f3" />
          <div className="ls-page ls-right" />
        </div>

        <h1 className="ls-title">Banca de Materiais</h1>
        <p className="ls-sub">
          Preparando seus estudos
          <span className="ls-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </p>

        <div className="ls-bar" aria-hidden="true">
          <span />
        </div>
      </div>

      <style>{`
        .ls-wrap {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7f5fb;
          overflow: hidden;
        }
        .ls-glow {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(157, 18, 245, 0.18), transparent 65%);
          animation: ls-pulse 3s ease-in-out infinite;
        }
        .ls-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: ls-enter 0.6s ease both;
        }

        .ls-book {
          position: relative;
          width: 160px;
          height: 108px;
          margin-bottom: 28px;
          perspective: 700px;
          animation: ls-float 3s ease-in-out infinite;
          filter: drop-shadow(0 18px 24px rgba(88, 12, 160, 0.28));
        }
        .ls-cover {
          position: absolute;
          inset: -6px -8px;
          border-radius: 10px;
          background: linear-gradient(135deg, #a21cf5, #5b0fb8);
        }
        .ls-page {
          position: absolute;
          top: 0;
          width: 80px;
          height: 108px;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0 14px,
              rgba(157, 18, 245, 0.18) 14px 16px
            ),
            #ffffff;
          background-size: calc(100% - 28px) 100%, 100% 100%;
          background-repeat: no-repeat;
          background-position: 14px 18px, 0 0;
        }
        .ls-left {
          left: 0;
          border-radius: 6px 0 0 6px;
          box-shadow: inset -8px 0 10px -8px rgba(0, 0, 0, 0.18);
        }
        .ls-right {
          left: 80px;
          border-radius: 0 6px 6px 0;
          box-shadow: inset 8px 0 10px -8px rgba(0, 0, 0, 0.18);
        }
        .ls-flip {
          left: 80px;
          border-radius: 0 6px 6px 0;
          transform-origin: left center;
          animation: ls-flip 2.4s ease-in-out infinite;
          background-color: #fbf7ff;
        }
        .ls-f1 { animation-delay: 0s; }
        .ls-f2 { animation-delay: 0.25s; }
        .ls-f3 { animation-delay: 0.5s; }

        @keyframes ls-flip {
          0%   { transform: rotateY(0deg);    opacity: 1; }
          45%  { transform: rotateY(-180deg); opacity: 1; }
          85%  { transform: rotateY(-180deg); opacity: 1; }
          100% { transform: rotateY(-180deg); opacity: 0; }
        }
        @keyframes ls-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes ls-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.8; }
          50%      { transform: scale(1.12); opacity: 1; }
        }
        @keyframes ls-enter {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ls-title {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #2a0a5e 0%, #9d12f5 50%, #2a0a5e 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ls-shine 3s linear infinite;
        }
        @keyframes ls-shine {
          to { background-position: -200% 0; }
        }
        .ls-sub {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          color: #6b6580;
        }
        .ls-dots { display: inline-flex; gap: 3px; margin-left: 2px; }
        .ls-dots i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #9d12f5;
          animation: ls-bounce 1.2s ease-in-out infinite;
        }
        .ls-dots i:nth-child(2) { animation-delay: 0.15s; }
        .ls-dots i:nth-child(3) { animation-delay: 0.3s; }
        @keyframes ls-bounce {
          0%, 80%, 100% { transform: translateY(0);  opacity: 0.4; }
          40%           { transform: translateY(-4px); opacity: 1; }
        }

        .ls-bar {
          width: 160px;
          height: 4px;
          margin-top: 14px;
          border-radius: 999px;
          background: rgba(157, 18, 245, 0.15);
          overflow: hidden;
        }
        .ls-bar span {
          display: block;
          width: 40%;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #a21cf5, #5b0fb8);
          animation: ls-slide 1.4s ease-in-out infinite;
        }
        @keyframes ls-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(260%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ls-wrap *, .ls-wrap { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
    </div>
  );
}
