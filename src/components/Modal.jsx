```jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { AuthContext } from '../context/AuthContext';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, children, className = '' }, ref) => {
    const { sanitizeInput } = useContext(AuthContext);
    const modalRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        modalRef.current?.focus();
      },
    }));

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        // Trap focus when the modal is open
        trapFocus(modalRef.current);
      } else {
        document.removeEventListener('keydown', handleKeyDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, onClose]);

    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        if (typeof onClose !== 'function') {
          console.warn('Modal: onClose prop should be a function.');
        }
      }
    }, [onClose]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    };

    const trapFocus = (element: HTMLElement | null) => {
      if (!element) return;

      const focusableElements = element.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0] as HTMLElement;
      const lastFocusableElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      element.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              event.preventDefault();
            }
          }
        }
      });

      // Focus on the first focusable element when the modal opens
      firstFocusableElement?.focus();
    };

    if (!isOpen) {
      return null;
    }

    const sanitizedChildren = useCallback(
      (children) => {
        if (typeof children === 'string') {
          return sanitizeInput(children);
        } else if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            children: sanitizedChildren(children.props.children),
          });
        } else if (Array.isArray(children)) {
          return children.map((child) => sanitizedChildren(child));
        }
        return children;
      },
      [sanitizeInput]
    );

    return (
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity"
        onClick={handleBackdropClick}
        aria-modal="true"
        role="dialog"
        style={{ display: isOpen ? 'flex' : 'none' }}
      >
        <div
          ref={modalRef}
          className={`bg-white rounded shadow-lg p-4 relative ${className}`}
          style={{maxWidth: '80%', maxHeight: '80%', overflowY: 'auto'}}
          tabIndex={0}
        >
          {sanitizedChildren(children)}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
```