# Gitlink-cli

This is a small command line utility to open the current remote repository in a browser from the command line.

The idea is that you're in terminal, working on a repo, then just type `gitlink` and your default browser magically opens the gitlab/github/bitbucket... url.

If you're not on a git repo, there's a nice and color error message.

Tested on mac only, created in a few minutes in node after banging my head on the table trying to make it work on bash.

## Installation

### Package managers (`yarn`, `npm`)
`yarn global add gitlink-cli`
`npm -g install gitlink-cli`

### Cloning
1. Clone this repo somewhere in your computer: `git clone https://github.com/bitbonsai/gitlink-cli.git`
2. `yarn link` in the directory is the fastest/easiest way to install (and be able to customize).
3. `npm link` also works, if you're not into yarn.

## Usage
Just go to a repo and type `gitlink` to open a browser window with the repo

Or add part of a `sha1` to it and open a single commit page: `gitlink b844b99` (thanks for the idea, @ricardobeat)