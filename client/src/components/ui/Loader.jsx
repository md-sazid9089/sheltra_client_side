export function Loader({ size = 40, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center min-h-[200px] ${className}`}
    >
      <div
        className="three-body"
        style={{ '--uib-size': `${size}px` }}
      >
        <div className="three-body__dot" />
        <div className="three-body__dot" />
        <div className="three-body__dot" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="three-body">
        <div className="three-body__dot" />
        <div className="three-body__dot" />
        <div className="three-body__dot" />
      </div>
    </div>
  );
}
