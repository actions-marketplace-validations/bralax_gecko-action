const core = require('@actions/core');
const github = require('@actions/github');
const ioUtil = require('@actions/io/lib/io-util');
const io = require('@actions/io');
const path = require('path');
const fs = require('fs');

const geckoToken = core.getInput('geckoToken');
const myToken = core.getInput('githubToken');

//joining path of directory
const directoryPath = process.env.GITHUB_WORKSPACE;
const metadata = {questions: []};

function getQuestions(files) {
    //listing all files using forEach
    let count = 0;
    files.forEach(function (file) {
        console.log(file);
        // Do whatever you want to do with the file
        let r = fs.lstatSync(path.join(directoryPath,file)).isDirectory();
        console.log(!isNaN(file));
        if (r && !isNaN(file)) {
            metadata.questions.push({questionNum: parseInt(file), versions: []});
            count++;
        }
    });
    return count;
}


let files = fs.readdirSync(directoryPath);
let count = getQuestions(files);
if (count === 0) {
    core.error("This repository does not contain any questions");
}
for (let i = 0; i < metadata.questions.length; i++) {
    files = fs.readdirSync(path.join(directoryPath, "" + metadata.questions[i].questionNum));
    //listing all files using forEach
    files.forEach(function (file) {
        const qNum = metadata.questions[i].questionNum;
        console.log(qNum + "/" + file);
        // Do whatever you want to do with the file
        let r = fs.lstatSync(path.join(directoryPath,"" + qNum,"" + file)).isDirectory();
        if (r && !isNaN("" + file)) {
            const question = metadata.questions[i];
            question.versions.push({version: parseInt(file), starterCodeFiles: []});
        }
    });
    for (let j = 0; j < metadata.questions[i].versions.length; j++) {
        files = fs.readdirSync(path.join(directoryPath, "" + metadata.questions[i].questionNum, "" + metadata.questions[i].versions[j].version));
        //listing all files using forEach
        files.forEach(function (file) {
            const qNum = metadata.questions[i].questionNum;
            const vNum = metadata.questions[i].versions[j].version;
            console.log(qNum + "/" + vNum + "/" + file);
            // Do whatever you want to do with the file
            let r = fs.lstatSync(path.join(directoryPath,"" + qNum,"" + vNum,"" + file)).isDirectory();
            if (!r && file !== "Question.html") {
                const version = metadata.questions[i].versions[j];
                version.starterCodeFiles.push(file);
            }
        });
    }
}


console.log(metadata);
