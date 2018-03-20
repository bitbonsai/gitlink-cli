#!/usr/bin/env node

const exec = require('child_process').exec;
const chalk = require('chalk');
const opn = require('opn');

// All arguments that don't start with two dashes
const args = process.argv.slice(2)
    .filter((key) => !/^--/.test(key));

// Simple args parser, turning --anything into an object.
// e.g. passing --print will generate {print: true}
const opts = process.argv.slice(2)
    .filter((key) => /^--/.test(key))
    .reduce((obj, key) => {
        obj[key.substr(2)] = true;
        return obj;
    }, {});

let commit_path = 'commit';
let origin = '';
let branch = 'master';

function printUrl(url) {
    console.log(`\n${chalk.blue.bold(url)}\n`);
}

function openUrl(url) {
    opn(url, { wait: false }) // wait:false so we don't wait for the browser to close
        .then(function(childProcess) {

            // But we need to wait for the process to close so we can know if it failed and fallback to --print
            childProcess.ref();

            childProcess.once('error', printUrl.bind(this, url));
            childProcess.once('close', function(code) {
                if (code > 0) {
                    printUrl(url);
                }
            });

        });
}

// get the current branch
exec('git symbolic-ref -q HEAD', function (err, stdout, stderr) {
    branch = stdout.trim().split('/').pop();
});

// get the remote's name
exec('git remote -v', function (err, stdout, stderr) {
    origin = stdout.split('\n')[0].split('\t')[0]
    exec(`git remote get-url --push ${origin}`, function (err, stdout, stderr) {

        let ret = stdout.trim().replace(':','/').replace('git@', 'https://').replace('.git','');

        // I'm passing a hash, show me the commit
        if (args.length) {
            if (ret.indexOf('bitbucket') != -1) {
                commit_path = 'commits';
            }
            ret += `/${commit_path}/${args[0]}`;
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
            if (opts.print) {
                printUrl(ret);
            } else {
                openUrl(ret);
            }
        } else {
            console.log(`${chalk.bgRed.bold(' ERROR: ')} ${chalk.red('No git remote found. The current path is:')} ${chalk.blue(__dirname)}`);
        }
    });
});
// why does bitbucket has to use different paths?