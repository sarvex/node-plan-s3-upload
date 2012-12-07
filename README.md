See [node-plan](https://github.com/superjoe30/node-plan).

See also [node-plan-s3-download](https://github.com/superjoe30/node-plan-s3-download).

### input

  * `tempPath` - the local file to upload to s3

### output

none

### options

  * `s3Key`
  * `s3Secret`
  * `s3Bucket`
  * `url` - string file path destination. These interpolations are available:
    * `$ext` - the extension of `tempPath` from the input. includes the '.'.
    * `$uuid` - a newly generated UUID string. looks something like this: 064c06bf-84e8-4a54-b0d2-d7acdefe20d2
    * `$$` - a literal '$'

### exports

  * `bucket` - copied directly from options
  * `url` - rendered url after applying interpolations
