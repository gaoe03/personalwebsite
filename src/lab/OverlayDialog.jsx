import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './overlay.css';

const CLOSE_DURATION_MS = 220;
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const OverlayDialog = ({ children, className = '', id, labelledBy, closeLabel, onClose, returnFocus }) => {
  const [isVisible, setIsVisible] = useState(false);
  const backdropRef = useRef(null);
  const surfaceRef = useRef(null);
  const closeButtonRef = useRef(null);
  const returnFocusRef = useRef(returnFocus || document.activeElement);
  const closeTimerRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const requestClose = useCallback(() => {
    if (closeTimerRef.current) return;
    setIsVisible(false);
    const closeDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : CLOSE_DURATION_MS;
    closeTimerRef.current = window.setTimeout(() => onCloseRef.current(), closeDelay);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const inertSiblings = [];
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
      closeButtonRef.current?.focus();

      Array.from(document.body.children).forEach((element) => {
        if (!(element instanceof HTMLElement) || element.contains(backdropRef.current)) return;
        inertSiblings.push([element, element.inert]);
        element.inert = true;
      });
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(surfaceRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || [])
        .filter((element) => element instanceof HTMLElement && element.getClientRects().length > 0);

      if (focusable.length === 0) {
        event.preventDefault();
        surfaceRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!surfaceRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(closeTimerRef.current);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      inertSiblings.forEach(([element, wasInert]) => {
        element.inert = wasInert;
      });
      if (returnFocusRef.current instanceof HTMLElement) returnFocusRef.current.focus();
    };
  }, [requestClose]);

  return createPortal(
    <div
      ref={backdropRef}
      className={`site-dialog-backdrop${isVisible ? ' is-visible' : ''}`}
      role="presentation"
      onMouseDown={requestClose}
    >
      <section
        ref={surfaceRef}
        id={id}
        className={`site-dialog-surface ${className}${isVisible ? ' is-visible' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="site-dialog-close"
          onClick={requestClose}
          aria-label={closeLabel}
        >
          <X size={18} />
        </button>
        {children}
      </section>
    </div>,
    document.body,
  );
};

export default OverlayDialog;
