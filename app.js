#!/usr/bin/env node

'use strict'

const version = require('./package.json').version

const app = require('commander')
const colors = require('colors')
const configPath = __dirname + '/config.json'
const config = require(configPath)
const fs = require('fs')

const saveConfig = newConfig => {
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2))
}

app.addHelpText('afterAll', ' ')

app
  .version(version)

app
  .command('about')
  .description('To known more about this app')
  .action(() => {
    console.log("")
    console.log(colors.blue(colors.bold("                          SSHER                            ")))
    console.log("")
    console.log(colors.gray("═══════════════════════════════════════════════════════════"))
    console.log(colors.white("             A small utility to save your ssh              "))
    console.log(colors.white("              profiles written in Node.js                  "))
    console.log(colors.gray("═══════════════════════════════════════════════════════════"))
    console.log("")
    console.log(colors.red(`Version: ${version}`))
    console.log("")
    console.log(colors.cyan("GitHub: https://github.com/lefuturiste/ssher"))
    console.log(colors.cyan("Report a bug/issue: https://github.com/lefuturiste/ssher/issues"))
    console.log(colors.cyan("Author: @_le_futuriste - https://lefuturiste.fr - contact@lefuturiste.fr"))
    console.log("")
  })

app
  .command('config-file-path')
  .option('-c, --clipboard', 'Copy path to clipboard')
  .description("Get the path of the config file")
  .action(context => {
    console.log(configPath)
    if (context.clipboard) {
      const clipboardy = require('clipboardy')
      clipboardy
        .write(configPath)
        .then(() => {
          console.log(colors.bgBlack(colors.cyan("Copied to clipboard")))
          process.exit()
        })
        .catch(err => {
          console.log(colors.bgBlack(colors.yellow("Failed to copy to clipboard")))
          console.error(err.message)
          process.exit(1)
        })
    }
  })

app
  .command('list')
  .description("List all profiles")
  .action(() => {
    console.log(colors.bgBlack(colors.magenta(colors.bold((`  ${config.profiles.length} item(s)`)))))
    config.profiles.forEach(p => {
      console.log(`- ${p.name}: ${p.username}@${p.host}:${p.port}`)
    })
  })

app
  .command('add')
  .description("Create a new profile")
  .action(async () => {
    const prompts = require('prompts')
    const questions = [
      { 
        type: 'text', name: 'name', validate: v => v.length > 0,
        message: 'Enter the name (or slug) to identify this profile'
      },
      {
        type: 'text', name: 'host', validate: v => v.length > 0,
        message: 'Enter the host of the SSH server'
      },
      {
        type: 'number', name: 'port', initial: 22, validate: v => v != 0,
        message: 'Enter the port of the SSH server'
      },
      {
        type: 'text', name: 'username', validate: v => v.length > 0,
        message: 'Enter the username'
      },
      {
        type: 'password', name: 'password', validate: v => v.length > 0,
        message: 'Enter the password'
      }
    ]
    const response = await prompts(questions)
    saveConfig({ profiles: [ ...config.profiles, response ] })
    console.log(colors.bgBlack(colors.green(colors.bold(`Created the profile with the name "${response.name}"`))))
  })

app
  .command('remove <name>')
  .description("Delete a new profile")
  .action(name => {
    let profile = config.profiles.filter(p => p.name == name)[0]
    if (profile == null) {
      console.log(colors.bgBlack(colors.yellow(`Profile "${name}" not found`)))
      return
    }
    let profiles = config.profiles.filter(p => p.name !== name)
    saveConfig({ profiles })
    console.log(colors.bgBlack(colors.green(colors.bold('Deleted the profile with name: "' + name + '"'))))
  })

app
  .command('connect <name>')
  .option('-c, --clipboard', 'Copy command to clipboard')
  .description("Connect to a profile defined in the configuration file")
  .action((name, context) => {
    let profile = config.profiles.filter(p => p.name == name)[0]
    if (profile == null) {
      console.log(colors.bgBlack(colors.yellow(colors.bold((`Profile "${name}" not found`)))))
      return
    }
    console.log(colors.bgBlack(colors.magenta(colors.bold((`Loading "${name}" profile's command...`)))))

    let cmd = `sshpass -p ${profile.password} ssh ${profile.username}@${profile.host} -p ${profile.port}`

    if (context.clipboard) {
      const clipboardy = require('clipboardy')
      clipboardy
        .write(cmd)
        .then(() => {
          console.log(colors.bgBlack(colors.cyan("Copied to clipboard")))
          process.exit()
        })
        .catch(err => {
          console.log(colors.bgBlack(colors.yellow("Failed to copy to clipboard")))
          console.error(err.message)
          process.exit(1)
        })
    } else {
      console.log(colors.bgBlack(colors.cyan(colors.bold((`Connecting to ssh server...`)))))
      const runScript = require('runscript')

      let endOfSession = () => console.log(colors.bgBlack(colors.yellow(colors.bold((`End of session.`)))))

      runScript(cmd)
        .then(endOfSession)
        .catch(endOfSession)
    }
  })

app.parse(process.argv)
