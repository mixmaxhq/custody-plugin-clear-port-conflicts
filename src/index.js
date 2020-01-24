const { detectPortConflict, clearPortConflict } = require('./utils');

module.exports = function({ debug, PROCESS_STATES }) {
  return {
    update(process) {
      const name = process.name;
      const conflictingPort = detectPortConflict(process, PROCESS_STATES);
      if (!conflictingPort) return;

      (async () => {
        debug(`Clearing conflict on port ${conflictingPort} used by ${name}`);
        await clearPortConflict(conflictingPort);

        debug('Port conflict cleared. Restarting', name);
        await process.restart();
      })().catch((e) => debug(`Could not fix port conflict for ${name}:`, e));
    },
  };
};
