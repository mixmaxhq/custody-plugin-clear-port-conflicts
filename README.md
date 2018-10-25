# custody-plugin-command-clear-port-conflicts

If you're using Supervisor for local development of microservices, the processes launched
by Supervisor are probably not the servers themselves but rather build processes, which in turn
launch the servers. The process tree might look something like this:

```
supervisord
  - gulp (using gulp-nodemon)
    - node
```

Something in this chain tends to lose the server process, so that it keeps running, but no longer
under Supervisor control. When, eventually, the "supervised" process starts/restarts, the new server
crashes with an EADDRINUSE error.

This [custody] plugin can automatically fix such port conflicts.

## Installation

```sh
npm install -g @custody/plugin-command-clear-port-conflicts
```

Then launch `custody-cli settings` and add "@custody/plugin-command-clear-port-conflicts" to your
`.custodyrc`. Finally, restart `custody-cli` to get it to pick up the new plugin.

This module requires that you instrument every process you wish to de-conflict with
[@custody/probe](https://github.com/mixmaxhq/custody-probe/#installation), please configure that
before proceeding. This is because this plugin requires @custody/probe to report the EADDRINUSE
error, as described [here](https://github.com/mixmaxhq/custody-probe/#custody-probe).

## Usage

Once you've set up the plugin and probe(s) as described above, this plugin will operate
automatically.

### How it works

When the plugin detects a port conflict, it will kill the process listening to your desired port,
then restart the supervised process.

## Contributing

We welcome bug reports and feature suggestions!

[custody]: https://github.com/mixmaxhq/custody/
