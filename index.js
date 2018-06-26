#!/usr/bin/env node

'use strict';
const app = require('commander')
const colors = require('colors')
var data = require('./data.json')

if (process.argv.length == 2) {
  console.log("show help with --help");
}

app
  .version('1.1.7')

app
  .command('config-file-path')
  .option('-c, --clipboard', 'Copy path to clipboard')
  .description("Get the path of the config file")
  .action(function (context) {
    const path = require('path')
    const globalDirs = require('global-dirs');
    var absolute = globalDirs.npm.packages + "/ssher/data.json"
    console.log(absolute);
    if (context.clipboard) {
      const clipboardy = require("clipboardy");
      clipboardy
        .write(absolute)
        .then(() => {
          console.log(colors.bgBlack(colors.cyan("Copied to clipboard")));
          process.exit();
        })
        .catch(err => {
          console.log(colors.bgBlack(colors.yellow("Failed to copy to clipboard")));
          console.error(err.message);
          process.exit(1);
        });
    }
  })

app
  .command('list')
  .description("List all profiles")
  .action(function (name, context) {
    console.log(colors.bgBlack(colors.magenta(colors.bold((`  ${data.sessions.length} item(s)`)))))
    data.sessions.forEach((item) => {
      console.log(`- ${item.name}: ${item.username}@${item.host}:${item.port}`);
    })
  })

app
  .command('connect <name>')
  .option('-c, --clipboard', 'Copy command to clipboard')
  .description("Connect to a session defined in the config file")
  .action(function(name, context) {
    var session = data.sessions.filter((item) => {
      return item.name == name
    })[0]
    if (session !== undefined) {
      console.log(colors.bgBlack(colors.magenta(colors.bold((`Loading "${name}" session's command...`)))))

      var cmd = `sshpass -p ${session.password} ssh ${session.username}@${session.host} -p ${session.port}`

      if (context.clipboard) {
        const clipboardy = require("clipboardy");
        clipboardy
          .write(cmd)
          .then(() => {
            console.log(colors.bgBlack(colors.cyan("Copied to clipboard")));
            process.exit();
          })
          .catch(err => {
            console.log(colors.bgBlack(colors.yellow("Failed to copy to clipboard")));
            console.error(err.message);
            process.exit(1);
          });
      } else {
        console.log(colors.bgBlack(colors.cyan(colors.bold((`Connecting to ssh server...`)))))
        const runScript = require('runscript');

        runScript(cmd)
          .then(stdio => {})
          .catch(err => {
            console.log(colors.bgBlack(colors.yellow(colors.bold((`End of session.`)))))
          });
      }

    } else {
      console.log(colors.bgBlack(colors.yellow(colors.bold((`Session "${name}" not found`)))))
    }
  })

app.parse(process.argv)
