const fs = require('fs');

module.exports =  (dir, ipRegex, done) => {
    const results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        list.forEach(function(file) {
            if(ipRegex.test(file)){
                results.push({path : `${dir}/${file}`,name:file});
            }
        });
        done(null,results);
    });
};
