
var fs = require('fs');
var path = require('path');

class BundleClean {
    constructor(options) {
        this.path = options.path || '.';
        this.filename = options.filename;
        if (!this.filename) {
            throw new Error('Require filename option');
        }
    }
    apply(compiler) {
        compiler.plugin('compile', function(factory, callback) {
            let filename = path.join(this.path, this.filename);
            try {
                fs.accessSync(filename, fs.constants.R_OK);
            } catch(e) {
                console.log(e.message);
                return;
            }
            try {
                let stats = JSON.parse(fs.readFileSync(filename));

                if (stats.chunks) {
                    Object.keys(stats.chunks).forEach(function(name) {
                        let chunk = stats.chunks[name];
                        if (chunk) {
                            for (let i = 0; i < chunk.length; i++) {
                                let _chunk = chunk[i]
                                if (_chunk && _chunk.path) {
                                    console.log('removing', _chunk.path);
                                    try {
                                        fs.unlinkSync(_chunk.path);
                                    } catch(e) {
                                        console.log(e.message);
                                    }
                                }
                            }
                        }
                    })
                }
            } catch(e) {
                console.log(e.message)
            }
        }.bind(this));
    }
}

module.exports = BundleClean;
