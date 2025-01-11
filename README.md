# Static Site / Api Gateway / Lambda

Lets make a fully serverless application using Cloudfront/S3 and Api Gateway.

We'll also include authentication using Cognito.

## Reddit

https://www.reddit.com/r/aws/comments/1hrf9sf/restrict_access_to_api_gateway_to_traffic_coming/

## Emptying out S3 bucket

In order to delete an S3 bucket, we must first empty it out. Do the following to empty out:

```bash
aws ls s3

# Output
# 2024-12-25 12:50:41 cdk-xxxx-xxxx-xxxxxx-us-east-1
# 2025-01-10 13:49:25 my-bucket-name

aws s3 rm s3://cognitoedgeauthstack-frontendbucketefe2e19c-oupqquowk6p6 --recursive
```

## Delete user pool

```bash
aws cognito-idp list-user-pools --max-results=10

aws cognito-idp delete-user-pool --user-pool-id=us-east-1_xxxxx
```

### Deployment
