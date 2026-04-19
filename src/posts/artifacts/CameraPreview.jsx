export default function CameraPreview() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, calc(-50% - 7px))',
          fontSize: '32px',
          lineHeight: 1,
        }}
        role="img"
        aria-hidden="true"
      >
        📸
      </span>
    </div>
  );
}
