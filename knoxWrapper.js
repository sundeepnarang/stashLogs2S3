/**
 * Created by sundeepnarang on 11/5/15.
 */


const knox          = require("knox");
const fs            = require("fs");

function Manager(config={},options={}){
    const {log=true} = options;
    const {awsConfig=false} = config;

    if(!awsConfig){
        throw new Error("Missing awsConfig");
    }
    this._client = knox.createClient(awsConfig);

    this._defaultMime = "application/octet-stream";

    // Methods

    // Utils

    this._log = function () {
        if(log){
            console.log.apply(console, arguments);
        }
    };
    // Put

    this._put = function({rstream, size, mime=this._defaultMime, loc}, done) {

        const req = this._client.put(loc, {
            'Content-Length': size
            , 'Content-Type': mime
        });

        req.on('response', function (res) {
            if (res.statusCode == 200) {
                return done(null, true);
            }
            const bufs = [];
            res.on('data', function (chunck) {
                bufs.push(chunck);
            });
            res.on('end', function () {
                const buff = Buffer.concat(bufs);
                const resStr = buff.toString("utf8");
                done(resStr);
            });
            res.resume();
        }).on('error', function (err) {
            done(err);
        });

        rstream.pipe(req);
    };

}

Manager.prototype.uploadFile = function({loc=false,filePath=false,suffix=false},done){
    const self = this;
    const{_log:log} = self;

    if(filePath===false){
        return done(new Error("No File Path"))
    }
    if(loc===false){
        return done(new Error("No Loc"))
    }

    if(suffix){
        loc = loc+suffix;
    }

    fs.stat(filePath,(err,{size}={})=>{
        if (err) {
            log("Error Loading File Stats : ", err);
            return done(err);
        }
        self._put({size,loc,rstream:fs.createReadStream(filePath)},done);
    });
};

module.exports = Manager;

