See [node-plan](https://github.com/superjoe30/node-plan)
See also [node-plan-s3-retrieve](https://github.com/superjoe30/node-plan-s3-retrieve)

### input

  * `tempPath` - the local file to upload to s3

### output

none

### options

  * `s3Key`
  * `s3Secret`
  * `s3Bucket`

### exports

  * `bucket` - copied directly from options
  * `url` - rendered url after applying interpolations
