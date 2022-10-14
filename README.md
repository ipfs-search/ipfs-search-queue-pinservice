# ipfs-search-queue-pinservice

Microservice implementing the IPFS pin service API to automatically push IPFS updates onto the [ipfs-search.com](https://ipfs-search.com) crawler queue.

## Dependencies

https://github.com/ipfs-search/ipfs-search

Have a crawler and the Rabbit MQ server running somewhere. 

Docker to build/start or node 16+ to run locally

## Usage

The microservice follows the IPFS pinservice API spec:
https://ipfs.github.io/pinning-services-api-spec/

Only [Add Pin](https://ipfs.github.io/pinning-services-api-spec/#operation/addPin) has been implemented.

## Testing

When running locally, you can test this as follows:

Steps to get up and running:

* clone https://github.com/ipfs-search/ipfs-search
* start ipfs-search in a terminal using `docker compose up ipfs-crawler` (or use `docker-compose`, depending on your system)
* start the queue-pinning-service in another terminal using `npm run start`
* navigate with the browser to http://localhost:7070/docs/#/pins/addPin
* Select "Try it out" under POST /pins
* modify the request body as you like; typically you want to put at least a valid CID
* click **Execute** (the big blue button)
* check below if you get a `202` Succesful response
* If you get a `202` response, verify in the ipfs-search terminal that the request came through

## ENV Configuration

The API can be configured through the following environment variables:

- `PORT` Port to run the service on _(default: `7070`)_
- `HOST` Host to run the service on _(default: `localhost`)_
- `QUEUE_HOST` address of the ipfs-search queue server _(default: `amqp://localhost`)_
