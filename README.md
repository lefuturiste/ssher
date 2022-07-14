# Ssher

A cool tiny tool to save your ssh profiles and use it. 

## Install

### Requirements

This app only run on linux (altought it may be possible to run it on windows, I didn't try so far).

This cli app require sshpass:

- Debian based distributions: `# apt install sshpass`
- Archlinux: `# pacman -S sshpass`

### Via npm

`npm install -g ssher`

If you have a EACCESS error you should check [this](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

## Usage

`ssher connect <name>`

`ssher connect <name> -c`: Copy the generated command into clipboard

`ssher list`: List all the profiles

`ssher add`: Create a profile in the config

`ssher remove <name>`: Remove a profile in the config

`ssher config-file-path`: Return the absolute path of the JSON config file

## Configuration

Edit the `config.json` file to add/edit the profiles.

Exemple of a `config.json` file :

```json
{
  "profiles": [
    {
      "name": "example",
      "host": "yourhost.com",
      "port": "22",
      "username": "youruser",
      "password": "yourpassword"
    }
  ]
}
```

## Support/Help/Contributions

Feel free to open a issue or a pull request I will be happy to answer any questions or help you with this library.

You can also use these alternative methods to contact me: 

- Email: [contact@lefuturiste.fr](mailto:contact@lefuturiste.fr) 
- Mastodon: [lefuturiste@mstdn.io](https://mstdn.io/@lefuturiste)
- Discord: `lefuturiste#5297`

## TODO

- Support windows platform
