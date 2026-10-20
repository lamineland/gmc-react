/**
 * ConfirmDialog.js
 * -------------------------------------------------------------
 * Modal confirmation prompt shown before a task is deleted.
 * The task is only removed when the user explicitly confirms, which
 * prevents accidental deletions.
 *
 * Extra behaviour:
 *  - "Escape" closes the dialog (cancelling the deletion)
 *  - clicking the backdrop cancels as well
 *  - focus starts on the Cancel button so a stray "Enter" cannot delete
 * -------------------------------------------------------------
 */

import { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

/**
 * @param {Object} props
 * @param {Object} props.task - task that would be deleted
 * @param {Function} props.onConfirm - actually delete the task
 * @param {Function} props.onCancel - close the dialog, keep the task
 */
function ConfirmDialog({ task, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  // Focus the safe action + support the Escape key while the dialog is open.
  useEffect(() => {
    cancelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    // Backdrop: clicking outside the dialog cancels the deletion.
    <div className="dialog-overlay" role="presentation" onClick={onCancel}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(event) => event.stopPropagation()} // clicks inside do not cancel
      >
        <h2 id="confirm-dialog-title" className="dialog__title">
          Delete this task?
        </h2>
        <p id="confirm-dialog-message" className="dialog__message">
          Are you sure you want to delete <strong>“{task.name}”</strong>? This action cannot be undone.
        </p>
        <div className="dialog__actions">
          <button type="button" className="button button--ghost" ref={cancelRef} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="button button--danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
