const async = require("async");
const fs    = require("fs");

const walker        = require("./walkDir");
const S3Manager     = require("./knoxWrapper");

module.exports = function({inputs, awsConfig,options={}},done=()=>{}){

    const {log = true} = options;

    const _log = function () {
        if(log){
            console.log.apply(console, arguments);
        }
    };

    const now = new Date();

    const datePrefix = `${now.getFullYear()}${now.getMonth()+1}${now.getDate()}`;

    const Manager = new S3Manager(awsConfig);

    function uploadFile(opPath){
        return function(file,done) {
            const {name, path} = file;
            Manager.uploadFile({loc: `${opPath}/${datePrefix}/${name}`, filePath: path}, (err) => {
                if (err) {
                    _log(`Errored in uploading [${path}] : `, err);
                    return done(null);
                }
                fs.unlink(path, (err) => {
                    if (err) {
                        _log(`Errored deleting [${path}] : `, err);
                        return done(null);
                    }
                    _log("Finished file : ", path);
                    return done(null);
                });
            });
        }
    }

    function stashDir({files,opPath,ipDir},done){
        async.eachSeries(files,uploadFile(opPath),(err)=>{
            if(err){
                _log(`Errored in dir [${ipDir}] : `,err);
                return done(null);
            }
            _log(`Finished directory [${ipDir}]`);
            return done(null);
        });
    }

    function processDirectory({ipDir=false, ipFileRegex=/./, opPath=""}={},done) {
        if(!ipDir){
            _log(`Errored no ipDir [${ipDir}] : `);
            return done(null);
        }
        walker(ipDir,ipFileRegex,(err,files=[])=>{
            if(err){
                _log(`Errored in dir [${ipDir}] : `,err);
                return done(null);
            }
            _log(`Started directory [${ipDir}]`);
            stashDir({files,opPath,ipDir},(err)=>{
                return done(err);
            })
        });
    }

    _log("Started!");

    async.eachSeries(inputs,processDirectory,(err)=>{
        if(err){
            return _log(`Errored : `,err);
        }
        return _log("Finished!");
    });
};

