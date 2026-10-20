/**
 * validation.js
 * -------------------------------------------------------------
 * Form-level validation rules for the add / edit task form.
 * The validator returns an object keyed by field name so every input
 * can display its own inline error message.
 * -------------------------------------------------------------
 */

import { LIMITS } from './taskUtils';

/**
 * Validate the task form values.
 * Both the name and the description are mandatory.
 * @param {Object} values - { name, description, dueDate, priority }
 * @returns {Object} errors keyed by field name (empty object when valid)
 */
export function validateTaskForm({ name, description }) {
  const errors = {};
  const trimmedName = (name ?? '').trim();
  const trimmedDescription = (description ?? '').trim();

  if (!trimmedName) {
    errors.name = 'Task name is required.';
  } else if (trimmedName.length > LIMITS.name) {
    errors.name = `Task name must be ${LIMITS.name} characters or fewer.`;
  }

  if (!trimmedDescription) {
    errors.description = 'Task description is required.';
  } else if (trimmedDescription.length > LIMITS.description) {
    errors.description = `Task description must be ${LIMITS.description} characters or fewer.`;
  }

  return errors;
}

/**
 * Convenience helper: does the error object contain anything?
 * @param {Object} errors - result of validateTaskForm
 * @returns {boolean} true when at least one field is invalid
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
