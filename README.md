# `ipfs-search-push`

Microservice implementing the IPFS pin service API to automatically push IPFS updates onto the [ipfs-search.com](https://ipfs-search.com) crawler queue.

## Dependencies

## Usage

## Configuration

The API can be configured through the following environment variables:

- `PORT` Port to run the service on _(default: `7070`)_
- `QUEUE_HOST` address of the ipfs-search queue server _(default: `amqp://localhost`)_
