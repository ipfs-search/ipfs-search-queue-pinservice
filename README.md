# ipfs-search-queue-pinservice

Microservice implementing the [IPFS pin service API](https://ipfs.github.io/pinning-services-api-spec/) to automatically push IPFS updates onto the [ipfs-search.com](https://ipfs-search.com) crawler queue.

## Getting started

Typically, you would need an ipfs-search rabbitMQ server running, and an ipfs daemon.

### building and running a local instance
```
npm install
npm run build
PINSERVICE_DELEGATES=`ipfs id | jq -r -c '.Addresses'` npm start
```

In stead of `npm run build; npm start` you can use `npm run dev`

### using docker

...

### Configuration

The API can be configured through the following environment variables:

- `PINSERVICE_DELEGATES` one or more multiaddr addresses for ipfs nodes used. 
  - Can be either a string, a number of strings chained with commas, or a JSON array
  - When running a local node, this can be generated using `` `ipfs id | jq -r -c '.Addresses'` ``
  - If no delegates are provided, the pinservice will still work, but the client may throw an error for getting a malformed response
- `PINSERVICE_PORT` Port to run the service on _(default: `7070`)_
- `PINSERVICE_HOST` Host to run the service on _(default: `localhost`)_
- `AMQP_URL` address of the ipfs-search queue server _(default: `amqp://localhost`)_
- `NODE_ENV` turns off swagger UI when set to `production` _(default: `development`)_
- `PROCESSES` amount of sibling workers in cluster; defaults to number of CPUs in system

## Dependencies

https://github.com/ipfs-search/ipfs-search

Have a crawler and the Rabbit MQ server running somewhere.

Docker to build/start or node 16+ to run locally

One or more ipfs nodes.

## Usage

## Pinning service API spec implementation

Only [Add Pin](https://ipfs.github.io/pinning-services-api-spec/#operation/addPin) has been implemented. [Replace pin object](bafybeib32tuqzs2wrc52rdt56cz73sqe3qu2deqdudssspnu4gbezmhig4) is routed to the **Add pin** service.

**List pin objects** returns an empty object.
Other calls throw a not-implemented error. 

N.b. Because the ipfs client immediately after **Add pin** checks for the status of the request using **Get pin object**, this gives an error. This does not mean the call did not come through!


## Testing

When running locally, you can test this as follows:

Steps to get up and running:

- clone https://github.com/ipfs-search/ipfs-search
- start ipfs-search in a terminal using `docker compose up ipfs-crawler` (or use `docker-compose`, depending on your system)
- start the queue-pinning-service in another terminal using `npm run start`
- navigate with the browser to http://localhost:7070/docs/#/pins/addPin
- Select "Try it out" under POST /pins
- modify the request body as you like; typically you want to put at least a valid CID
- click **Execute** (the big blue button)
- check below if you get a `202` Succesful response
- If you get a `202` response, verify in the ipfs-search terminal that the request came through

