# `ipfs-search-queue-pinservice`

Microservice implementing the IPFS pin service API to automatically push IPFS updates onto the [ipfs-search.com](https://ipfs-search.com) crawler queue.

## Dependencies

https://github.com/ipfs-search/ipfs-search

Have a crawler and the Rabbit MQ server running.

## Usage

The microservice follows the IPFS pinservice API spec:
https://ipfs.github.io/pinning-services-api-spec/

Only [Add Pin](https://ipfs.github.io/pinning-services-api-spec/#operation/addPin) has been implemented.

When running locally, you can test this at: http://localhost:7070/docs/ 

If sending the test request, the crawler should pick it up.

## Configuration

The API can be configured through the following environment variables:

- `PORT` Port to run the service on _(default: `7070`)_
- `QUEUE_HOST` address of the ipfs-search queue server _(default: `amqp://localhost`)_
