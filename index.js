#!/usr/bin/env node

const exec = require('child_process').exec;
const chalk = require('chalk');

const args = process.argv;

exec("git remote get-url --push origin", function (err, stdout, stderr) {
    
    let ret = stdout.trim().replace(':','/').replace('git@', 'https://').replace('.git','');

    // I'm passing a hash, show me the commit
    if (args.length > 1) {
        ret += `/commit/${args[2]}`;
    }
    
    if (ret) {
        exec(`open "${ret}"`);
    } else {
        console.log(`${chalk.bgRed.bold(' ERROR: ')} ${chalk.red('No git remote found. The current path is:')} ${chalk.blue(__dirname)}`);
    }
});