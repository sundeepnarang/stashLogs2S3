const fs = require('fs');

module.exports =  (dir, ipRegex, done) => {
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        list = list
            .filter(file=>ipRegex.test(file))
            .map(file=>{return {path : `${dir}/${file}`,name:file}});
        done(null,list);
    });
};
