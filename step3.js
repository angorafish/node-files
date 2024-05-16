const fs = require('fs');
const process = require('process');
const axios = require('axios');
const path = require('path');

function cat(path, writePath = null) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${path}:`);
            console.error(err);
            process.exit(1);
        }
        if (writePath) {
            writeToFile(writePath, data);
        } else {
            console.log(data);
        }
    });
}

async function webCat(url, writePath = null) {
    try {
        const response = await axios.get(url);
        if (writePath) {
            writeToFile(writePath, response.data);
        } else {
            console.log(response.data);
        }
    } catch (err) {
        console.error(`Error fetching ${url}:`);
        console.error(err);
        process.exit(1);
    }
}

function writeToFile(writePath, data) {
    fs.writeFile(writePath, data, 'utf8', (err) => {
        if (err) {
            console.error(`Couldn't write ${writePath}:`);
            console.error(err);
            process.exit(1);
        }
    });
}

const args = process.argv.slice(2);
let writePath = null;
let pathOrUrl = null;

if (args[0] === '--out') {
    writePath = args[1];
    pathOrUrl = args[2];
} else {
    pathOrUrl = args[0];
}

if (pathOrUrl) {
    if (pathOrUrl.startsWith('http')) {
        webCat(pathOrUrl, writePath);
    } else {
        cat(pathOrUrl, writePath);
    }
} else {
    console.error('Please provide a file path or URL');
    process.exit(1);
}