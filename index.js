#!/usr/bin/env node

const exec = require('child_process').exec;
const chalk = require('chalk');
const args = process.argv;

let commit_path = 'commit';
let origin = '';
let branch = 'master';
let is_mac = false;

// get the current branch
exec('git symbolic-ref -q HEAD', function (err, stdout, stderr) {
    branch = stdout.trim().split('/').pop();
});

// get if I'm on mac (to use open)
exec('uname', function (err, stdout, stderr) {
    is_mac = (stdout.indexOf('Darwin') > -1) ? true : false;
});

// get the remote's name
exec('git remote -v', function (err, stdout, stderr) {
    origin = stdout.split('\n')[0].split('\t')[0]
    exec(`git remote get-url --push ${origin}`, function (err, stdout, stderr) {

        let ret = stdout.trim().replace(':','/').replace('git@', 'https://').replace('.git','');

        // I'm passing a hash, show me the commit
        if (args.length > 2) {
            if (ret.indexOf('bitbucket') != -1) {
                commit_path = 'commits';
            }
                ret += `/${commit_path}/${args[2]}`;
        } else {
            if (branch != 'master') {
                if (ret.indexOf('bitbucket') != -1) {
                    ret += `/branch/${branch}`
                } else {
                    ret += `/tree/${branch}`
                }
            }
        }

        if (ret) {
            if (is_mac) {
                exec(`open "${ret}"`);
            } else {
                console.log(`\n${chalk.blue.bold(ret)}\n`);
            }
        } else {
            console.log(`${chalk.bgRed.bold(' ERROR: ')} ${chalk.red('No git remote found. The current path is:')} ${chalk.blue(__dirname)}`);
        }
    });
});
// why does bitbucket has to use different paths?