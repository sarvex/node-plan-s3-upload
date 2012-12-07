var definition = require('../')
  , Plan = require('plan')
  , assert = require('assert')
  , fs = require('fs')
  , path = require('path')

var tmpFilePath = path.join(__dirname, "tmp.foo");

describe("s3-upload", function() {
  it("works", function(done) {
    fs.writeFile(tmpFilePath, "abcd", function(err) {
      if (err) return done(err);
      var task = Plan.createTask(definition, 's3-upload', {
        url: '/{uuid}/{brace}}/{brace}ext/blah{ext}',
        s3Key: process.env.S3_KEY,
        s3Secret: process.env.S3_SECRET,
        s3Bucket: process.env.S3_BUCKET,
      });
      var plan = new Plan();
      plan.addTask(task);
      plan.on('error', done);
      plan.on('end', function() {
        fs.unlink(tmpFilePath, function(err) {
          if (err) return done(err);
          assert.ok(/^\/[a-f0-9\-]{36}\/\{\}\/\{ext\/blah\.foo$/.test(task.exports.url),
            "unexpected url: " + task.exports.url);
          done();
        });
      });
      plan.start({
        tempPath: tmpFilePath,
      });
    })
  });
  it("causes error when you forget key", function(done) {
    fs.writeFile(tmpFilePath, "abcd", function(err) {
      if (err) return done(err);
      var task = Plan.createTask(definition, 's3-upload', {
        url: '/blahblahblah',
        s3Secret: process.env.S3_SECRET,
        s3Bucket: process.env.S3_BUCKET,
      });
      var plan = new Plan();
      plan.addTask(task);
      plan.on('error', function(err){
        fs.unlink(tmpFilePath, function(err) {
          if (err) return done(err);
          done();
        });
      });
      plan.on('end', function() {
        done(new Error("should emit error when s3 key is omitted"));
      });
      plan.start({
        tempPath: tmpFilePath,
      });
    });
  });
  it("works with interpolation at the beginning", function(done) {
    fs.writeFile(tmpFilePath, "abcd", function(err) {
      if (err) return done(err);
      var task = Plan.createTask(definition, 's3-upload', {
        url: '{ext}{ext}',
        s3Key: process.env.S3_KEY,
        s3Secret: process.env.S3_SECRET,
        s3Bucket: process.env.S3_BUCKET,
      });
      var plan = new Plan();
      plan.addTask(task);
      plan.on('error', done);
      plan.on('end', function() {
        fs.unlink(tmpFilePath, function(err) {
          if (err) return done(err);
          assert.strictEqual(".foo.foo", task.exports.url);
          done();
        });
      });
      plan.start({
        tempPath: tmpFilePath,
      });
    })
  });
});
