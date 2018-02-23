#!/usr/bin/env node
const program = require("commander");
const fse = require('fs-extra');
const exec = require('child_process').exec;
const chalk = require('chalk');
// const inquirer = require('inquirer');
// const _ = require('lodash');

const Util = require('./function');
const APP_INFO = require('./constant');
const startTime = Date.now();

program
    // 取消自动报错机制
    .allowUnknownOption()
    .version(`${APP_INFO.version}`)
    .description('用于' + chalk.red(`${APP_INFO.desc}`))
    .option('-s, --source <path>', '包路径(绝对路径)<必须>')
    .option('-t, --target <path>', '安装该包项目路径(绝对路径)<必须>')
    .option('-o, --output [path]', '该包构建生产环境目录名[非必须]')
    //自定义帮助信息
    .on('--help', function() {
        process.stdout.write('\n');
        Util.log(chalk.black.bgCyan('  Examples:'));
        process.stdout.write('\n');
        Util.log(chalk.green(`    # ${APP_INFO.desc}`))
        Util.log(`    $ ${APP_INFO.name} -s /Users/XXX -t /Users/YYY -o ZZZ`);
        process.stdout.write('\n');
    });

program.parse(process.argv);

(!program.source || !program.target) && program.help();

/**
 * syncPackage 构建 + 拷贝
 * @param: source String 想要拷贝的源目录路径
 * @param: target String 想要拷贝的目标目录路径
 * @param: target String 想要拷贝的目标目录路径
 */
const syncPackage = (source, target, output='dist') => {
    const sourcePackagePath = `${source}/package.json`;

    if (!Util.validPath(source) || !fse.existsSync(sourcePackagePath)) {
        // TODO 重新输入

        // await inquirer.prompt([
        //     {
        //         type: 'input',
        //         name: 'source',
        //         message: '重新输入拷贝的源目录路径',
        //         validate: (input) => {
        //             if (!Util.validPath(source) || !fse.existsSync(sourcePackagePath)) {
        //                 return '路径不合理，请重新输入';
        //             }

        //             return true;
        //         }
        //     }
        // ]).then((answers) => {

        // });
        Util.log(chalk.red(`  源目录路径输入有误`) + ` 请核对后重新运行`);
        process.exit();
    }

    if (!Util.validPath(target)) {
        Util.log(chalk.red(`  目标目录路径输入有误`) + ` 请核对后重新运行`);
        process.exit();
    }

    source = source.replace(/\/$/, '');
    target = target.replace(/\/$/, '');
    output = output.replace(/(^\/)|(\/$)/g, '');

    const packageInfo = require(sourcePackagePath);
    const {name} = packageInfo;

    fse.ensureDirSync(target);

    Util.log(chalk.blue(`  包路径: `) + `${source}`);
    Util.log(chalk.blue(`  安装该包项目路径: `) +  `${target}`);
    Util.log(chalk.blue(`  该包构建生产环境目录名: `) +  `${output}`);
    Util.log(chalk.blue(`  包名称: `) + `${name}`);

    const processAnimation = Util.showLoadingWithText('  正在构建...');

    const child = exec(`cd ${source} && npm run prepare`, (errRelease, stdoutRelease, stderrRelease) => {

        Util.log(stdoutRelease);

        processAnimation.stop();

        if (errRelease) {
            Util.log(chalk.red('  🎌 构建出错!'));
            throw errRelease;
        }

        process.stdout.write('\n');
        Util.log(chalk.cyan('  正在拷贝...'));

        try {
            fse.copySync(`${source}/package.json`, `${target}/node_modules/${name}/package.json`)
        } catch (errCopyFile) {
            Util.log(chalk.red('  🎌 拷贝 package.json 出错!'));
            throw errCopyFile;
        }

        fse.copy(`${source}/${output}/`, `${target}/node_modules/${name}/${output}/`)
            .then(() => {
                const durationS = (Date.now() - startTime) / 1000;

                Util.log(chalk.green(`  ✨ 同步完成!`));
                Util.log(`  用时 ` + chalk.magenta(`💡 ${durationS}`) + ` s`);
            })
            .catch(errCopyDirectory => {
                Util.log(chalk.red('  🎌 拷贝出错!'));
                throw errCopyDirectory;
            });
    });
};

syncPackage(program.source, program.target, program.output);