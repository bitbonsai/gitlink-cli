#!/usr/bin/env node

const exec = require('child_process').exec;
const chalk = require('chalk');

exec("git remote get-url --push origin", function (err, stdout, stderr) {
    let ret = stdout.trim().replace(':','/').replace('git@', 'https://');
    if (ret) {
        exec(`open "${ret}"`);
    } else {
        console.log(`${chalk.bgRed.bold(' ERROR: ')} ${chalk.red('No git remote found. The current path is:')} ${chalk.blue(__dirname)}`);
    }
});