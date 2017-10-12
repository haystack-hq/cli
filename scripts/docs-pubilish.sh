#!/bin/bash

#build the documents to docs/site
echo "Building the docs"
cd ./docs
mkdocs build --clean

#upload the documents to the S3 bucket
echo "Uploading to S3 bucket"
aws s3 sync ../docs/build s3://www.haystackhub.com/docs --acl public-read --cache-control "public, max-age=86400" 

