/**
 * store.js
 * -------------------------------------------------------------
 * The single Redux store of the application.
 *
 * It is created ONCE here and shared with React through the
 * <Provider> in src/index.js. Components read the state with
 * `useSelector` and change it with `useDispatch`.
 *
 * Note: `legacy_createStore` is the classic Redux `createStore`
 * under its new name (Redux 5 keeps the old name only as a
 * deprecated alias).
 * -------------------------------------------------------------
 */

import { legacy_createStore as createStore } from 'redux';
import rootReducer from './reducer';

/**
 * Create a fresh store.
 * Exported separately so tests can start from a clean state,
 * exactly like the one and only store used by the application.
 * @returns {Object} Redux store
 */
export function makeStore() {
  return createStore(rootReducer);
}

const store = makeStore();

export default store;
