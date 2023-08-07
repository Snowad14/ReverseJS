// deobfuscation with https://github.com/ben-sb/obfuscator-io-deobfuscator, Now I'm going to try and learn how to create these obfuscators
const crypto = require('crypto');

function reverseString(str) {
    return [...str].reverse().join('');
};

function numberArrayFromHexString (hexString) {
    let numArray = [];
    for (let i = 0; i < hexString.length; i += 2) {
        numArray.push(parseInt(hexString.substr(i, 2), 16));
    }
    return numArray;
};

function hexFromNumber(num) {
    let hexString = num.toString(16);
    if (hexString.length < 2) {
        hexString = '0' + hexString;
    }
    return hexString;
};

function randomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function md5Hash(s) {
    const hash = crypto.createHash('md5').update(s).digest('hex'); 
    return reverseString(hash);
};

function encryption (input, time) {
    let randomNumbers = [];
    for (let i = 0; i < 16; i += 1) {
        randomNumbers.push(randomIntInRange(101, 240));
    }
    let randomHex = randomNumbers.map(hexFromNumber).join('');

    let md5Input = md5Hash(input);
    let md5NumberArray = numberArrayFromHexString(md5Input);

    let xorRandomMd5 = [];
    for (let i = 0; i < 16; i += 1) {
        xorRandomMd5.push(randomNumbers[i] ^ md5NumberArray[i]);
    }

    let timeArray = [];
    let timeString = time.toString();
    for (let i = 0; i < timeString.length; i += 1) {
        timeArray.push(2 * Number.parseInt(timeString[i]) + 33);
    }

    let xorTimeRandom = [];
    for (let i = 0; i < 16; i += 1) {
        xorTimeRandom.push(xorRandomMd5[i] ^ timeArray[i]);
    }

    let encryptedOutput = xorTimeRandom.map(hexFromNumber).join('');

    return atob(reverseString("QMwsGd")) + randomHex + encryptedOutput;
};
  
function generateOutput(input) {
    let timeStamp = parseInt(Date.now().toString() + randomIntInRange(111, 999).toString());
    return JSON.parse("{\"" + "x-kspx-00" + "\":\"" + encryption(input, timeStamp) + "\",\"" + "x-tx-00" + "\":\"" + timeStamp.toString() + "\"}");
};

console.log(generateOutput("didISuccess=Yes"))