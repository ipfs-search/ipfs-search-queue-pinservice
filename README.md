# ipfs-search-queue-pinservice

Microservice implementing the [IPFS pin service API](https://ipfs.github.io/pinning-services-api-spec/) to automatically push IPFS updates onto the [ipfs-search.com](https://ipfs-search.com) crawler queue.

## Getting started

### Dependencies:

Typically, you would need at least an ipfs-search rabbitMQ server running, and an ipfs daemon. You probably also want an ipfs-search crawler associated with the rabbitMQ server.

You can start a local ipfs daemon using `ipfs daemon` (See https://docs.ipfs.tech/install/command-line/#which-node-should-you-use-with-the-command-line)

You can run rabbitMQ and the ipfs-search crawler by cloning https://github.com/ipfs-search/ipfs-search and running:

```
docker compose up ipfs-crawler
```

For detailed instructions, see https://ipfs-search.readthedocs.io/en/latest/guides.html

N.b. In case of errors, you may need to run `curl -X PUT "localhost:9200/ipfs_invalids;localhost:9200/ipfs_files;localhost:9200/ipfs_partials;localhost:9200/ipfs_directories`

### Building and running a local instance

```
npm install
npm run build
PINSERVICE_DELEGATES=`ipfs id | jq -r -c '.Addresses'` npm start
```

N.b. This assumes you have a local ipfs daemon running. You can also supply other delegates. The service will work without delegates but your client may report an error when pushing CIDs.

N.b. In stead of `npm run build; npm start` you can use `npm run dev`

### Using docker-compose

You can also run the queue-pinservice using docker-compose from the ipfs-search directory.

```
docker compose up pinservice
```

For this to work, it is necessary to have both projects cloned in the same parent directory and the pinservice directory needs to have the default git-clone name.

## Configuration

The API can be configured through the following environment variables:

- `PINSERVICE_DELEGATES` one or more multiaddr addresses for ipfs nodes used.
  - Can be either a string, a number of strings chained with commas, or a JSON array
  - When running a local node, this can be generated using `` `ipfs id | jq -r -c '.Addresses'` ``
  - If no delegates are provided, the pinservice will still work, but the client may throw an error for getting a malformed response
- `PINSERVICE_PORT` Port to run the service on _(default: `7070`)_
- `PINSERVICE_HOST` Host to run the service on _(default: `localhost`)_
- `AMQP_URL` address of the ipfs-search queue server _(default: `amqp://guest:guest@localhost:5672`)_
- `NODE_ENV` turns off swagger UI when set to `production` _(default: `development`)_
- `PROCESSES` amount of sibling workers in cluster; defaults to number of CPUs in system

## Usage

### Authentication

Note that (for now), authentication has been disabled, because there is no persistent data storage.
Nonetheless, the ipfs client expects an authentication key and won't work without one. You can use anything, but not nothing.

### Using a local pinning service

Setting up the ipfs client for local queue pinning service with default settings:

```
ipfs pin remote service add queue-pinservice http://localhost:7070 anythingWorksHere
```

Sending a CID to this queue pinning service:

```
ipfs pin remote add --service=queue-pinservice --name=war-and-peace.txt bafybeib32tuqzs2wrc52rdt56cz73sqe3qu2deqdudssspnu4gbezmhig4
```

If you have access to crawler logs you should see a message there with your CID.

**N.b.** Because the ipfs client immediately after **Add pin** checks for the status of the request using **Get pin object**, this gives a not-implemented-error (code `456`).
This does not mean the call did not come through! There is simply no persistent data to retrieve about the call, and no way to reconstruct this information (at least for now).

Generic documentation for using pinning services: https://docs.ipfs.tech/how-to/work-with-pinning-services/

## Pinning service API spec implementation

Only [Add Pin](https://ipfs.github.io/pinning-services-api-spec/#operation/addPin) has been implemented. [Replace pin object](bafybeib32tuqzs2wrc52rdt56cz73sqe3qu2deqdudssspnu4gbezmhig4) is routed to the **Add pin** service.

**List pin objects** returns an empty object.

Other calls throw a not-implemented error with code `456`.

### Testing using Swagger UI

When running with default settings, the swagger UI is revealed at `http://localhost:7070/docs`

- http://localhost:7070/docs/#/pins/addPin
- Select "Try it out" under POST /pins
- modify the request body as you like; to get a positive response, you must put a valid CID
- click **Execute** (the big blue button)
- If you get a `202` response, you can see a message in the crawler logs with your CID, (assuming that you connected the rabbitMQ server to a crawler and you have access to its logs)
