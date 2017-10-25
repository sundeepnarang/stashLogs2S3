# stashLogs2S3

A simple module to move all you logs to S3. No complicated memory draining searches and indexing, just a stasher.

ELK stack is maybe the best log stasher and analyzer out there. However, sometimes you need something small to just archive all your logs and nothing more. This module does just that.

### Usage

#### Install

`npm i stashlogs2s3`

#### Usage
```javascript
const stashLogs2S3 = require("stashLogs2S3");
const {awsConfig, inputs} = require("./config");

stashLogs2S3({awsConfig,inputs},()=>{
    console.log("Done!");
});
```

#### Sample Config

```javascript
// This is passed to Knox.js to connect to S3.
exports.awsConfig = {
   key: 'Your Key'
   , secret: 'Your Secret'
   , bucket: 'Your Bucket'
   , region: 'us-west-2'
};

// Array of Directories to stash
exports.inputs = [
    {
        ipDir : "Path to directory containing logs",
        ipFileRegex  : /.*log/i,
        opPath : `Path on S3 Bucket`,
        datePrefix : true 
    }
];
    
``` 

You may read more about knox.js and its config options [here](https://github.com/Automattic/knox#client-creation-options)
   
#### Input Options

You may pass an array of object with following options:

##### ipDir

Path to the directory you wanna stash logs from

##### ipFileRegex

Regex to filter log files in `ipDir`.

_Default_ : `/./` (Will take all files)

##### opPath

Location on S3 bucket to store files.

##### prefix

_Defaut_ : `true`, adds a date string of format `YYYYMMDD` to opPath, so logs are organized in folders by date.
`false` will not add any date strings.

