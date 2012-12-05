var path = require('path')
  , makeUuid = require('node-uuid').v4
  , s3 = require('s3');

function applyInterpolations(string, interps) {
  var name, value, re;
  for (name in interps) {
    value = interps[name];
    if (! value) throw new Error("unrecognized interpolation: " + name);
    re = new RegExp("[^\\$]\\$" + name, "g");
    string = string.replace(re, value);
  }
  return string.replace(/\$\$/g, '$');
}

module.exports = {
  start: function(done) {
    var self = this;
    var client = s3.createClient({
      key: self.options.s3Key,
      secret: self.options.s3Secret,
      bucket: self.options.s3Bucket,
    });
    self.exports.bucket = self.options.s3Bucket;

    // consume the callback url
    var tempPath = self.context.tempPath;
    delete self.context.tempPath;

    var interps = {
      ext: path.extname(tempPath),
      uuid: makeUuid(),
    };
    try {
      self.exports.url = applyInterpolations(self.options.url, interps);
    } catch (err) {
      done(err);
      return;
    }
    self.emit('update');
    var uploader = client.upload(tempPath, self.exports.url);
    uploader.on('error', function (err) {
      done(err);
    });
    uploader.on('progress', function(amountDone, amountTotal) {
      self.exports.amountDone = amountDone;
      self.exports.amountTotal = amountTotal;
      self.emit('progress');
    });
    uploader.on('end', function() {
      done();
    });
  }
};
