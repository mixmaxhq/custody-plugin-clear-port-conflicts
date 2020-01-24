const _ = require('underscore');
const { promisify } = require('promise-callbacks');

const exec = promisify(require('child_process').exec);

/**
 * Determines whether the process has crashed due to a port conflict, and if so, returns the
 * port in question.
 *
 * @param {Process} process - The process to analyze.
 * @param {PROCESS_STATES} STATES - The states of the process' lifecycle.
 *
 * @return {Int|null} The port in conflict, if any, or `null` if none.
 */
function detectPortConflict(process, STATES) {
  const { state, description } = process.effectiveState;
  if (state === STATES.FATAL) {
    const portString = _.last(description.match(/EADDRINUSE.+?(\d+)/));
    if (portString) return parseInt(portString, 10);
  }
  return null;
}

/**
 * Clears a port conflict by killing the process listening to that port.
 *
 * @param {Int} port - The port to clear.
 *
 * @return {Promise<Error>} A promise that resolves to `undefined` if the port is successfully
 *   cleared, otherwise rejects with the error.
 */
async function clearPortConflict(port) {
  return exec(`kill -9 $(lsof -ti :${port})`);
}

module.exports = {
  detectPortConflict,
  clearPortConflict,
};
