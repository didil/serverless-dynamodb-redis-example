# Serverless Lambda DynamoDB Example
Serverless example illustrating Dynamodb usage / async lambda invocation / redis cache usage for the following flows:

- Lambda (createNote) => DynamoDB 
- Lambda (getNote) [cache miss] => DynamoDB => Lambda (cacheNote) => RedisCache 
- Lambda (getNote) [cache hit] 

Components : API Gateway / Lambda / Redis / DynamoDB

I've used a Redis Cloud instance instead of using Elasticache to make the setup easier

## Setup

- Install Node 8.10 (latest runtime supported by AWS Lambda)

- Install serverless (tested against serverless v1.28.0)
````
$ npm i -g serverless 
````
- Install node modules
````
$ npm i 
````
- Initialize env variables file
````
$ cp env.yml.example env.yml 
````
- Run tests
````
$ npm test
````

## Usage Example
Using httpie cli

1 - create a note

````
$ http POST https://xxx.execute-api.us-east-1.amazonaws.com/dev/notes/create category="physics" content="the water boils"
HTTP/1.1 200 OK
{
    "category": "physics",
    "content": "the water boils",
    "createdAt": 1531998582225,
    "noteId": "3c677410-8b44-11e8-a588-fbe6ded7f57f"
}

````
2 - fetch a note. The first GET request goes to db / cache miss
````
http GET https://xxx.execute-api.us-east-1.amazonaws.com/dev/notes/physics/3c677410-8b44-11e8-a588-fbe6ded7f57f
{
    "cacheHit": false,
    "note": {
        "category": "physics",
        "content": "the water boils",
        "createdAt": 1531998582225,
        "noteId": "3c677410-8b44-11e8-a588-fbe6ded7f57f"
    }
}
````
3 - fetch a note. The second GET request fetches from the redis cache !
````
http GET https://xxx.execute-api.us-east-1.amazonaws.com/dev/notes/physics/3c677410-8b44-11e8-a588-fbe6ded7f57f
{
    "cacheHit": true,
    "note": {
        "category": "physics",
        "content": "the water boils",
        "createdAt": 1531998582225,
        "noteId": "3c677410-8b44-11e8-a588-fbe6ded7f57f"
    }
}
````


## TODO:
Add unit/integration tests
