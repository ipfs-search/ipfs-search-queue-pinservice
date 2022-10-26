# ipfs-search-queue-pinservice

Microservice implementing the [IPFS pin service API](https://ipfs.github.io/pinning-services-api-spec/) to push IPFS updates onto the [ipfs-search.com](https://ipfs-search.com) crawler queue.

## Getting started

### Dependencies

#### Services

[ipfs-search](https://github.com/ipfs-search/ipfs-search) crawler and dependencies thereof.

Easiest way to start dependencies is by running ipfs-search through `docker compose`:

1. `git clone https://github.com/ipfs-search/ipfs-search`
2. `cd ipfs-search`
3. `docker compose up ipfs-crawler`

Once you see something like this, the crawler is running:

```
ipfs-search-ipfs-crawler-1     | Starting 120 workers for files
ipfs-search-ipfs-crawler-1     | Starting 70 workers for hashes
ipfs-search-ipfs-crawler-1     | Starting 70 workers for directories
```

For detailed instructions, see https://ipfs-search.readthedocs.io/en/latest/guides.html

Note that, pending on resolution of https://github.com/ipfs-search/ipfs-search/issues/223, you might need to manually created required indexes, like such:
`curl -X PUT "localhost:9200/ipfs_invalids;localhost:9200/ipfs_files;localhost:9200/ipfs_partials;localhost:9200/ipfs_directories`

#### Node dependencies

Install Node dependencies through NPM:

`npm install`

### Starting the server

#### Get delegates

You will need to acquire the multiaddr of at least one IPFS node and define `PINSERVICE_DELEGATES` as a JSON list. This is the address which the client will connect to in order to speed up transfers.
Axample: `PINSERVICE_DELEGATES=["/ip4/192.168.1.94/udp/4001/quic/p2p/12D3KooWCfksHSx489oMAH2ysfNTvVtzQLj4u5PHfrXckYNzUU4x"]`

If you are using `docker compose` to start the crawler as described above, you already have one running in Docker.

Assuming you have [jq](https://stedolan.github.io/jq/) installed, _from within the `ipfs-search` directory_, you can run:

```sh
ipfs-search % export PINSERVICE_DELEGATES=`docker compose exec ipfs ipfs id | jq -c .Addresses`
```

You may check for a correct value like such:

```sh
ipfs-search % echo $PINSERVICE_DELEGATES
["/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N","/ip4/127.0.0.1/udp/4001/quic/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N","/ip4/141.43.241.161/tcp/4001/p2p/12D3KooWRc4xyoRgW3mhn6dBxkFQC64iaBgCEzoZTUTog5geNupw/p2p-circuit/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N","/ip4/142.43.241.161/udp/4001/quic/p2p/12D3KooWRc4xyoRgW3mhn6dBxkFQC64iaBgCEzoZTUTog5geNupw/p2p-circuit/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N","/ip4/154.53.33.68/tcp/4001/p2p/12D3KooWF1q1ND1DnzTQbW29tsjSYF7iy57Xa1gBM5T3QDQ2rcBe/p2p-circuit/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N","/ip4/154.53.33.68/udp/4001/quic/p2p/12D3KooWF1q1ND1DnzTQbW29tsjSYF7iy57Xa1gBM5T3QDQ2rcBe/p2p-circuit/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N","/ip4/172.18.0.11/tcp/4001/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N","/ip4/172.18.0.11/udp/4001/quic/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N","/ip6/2606:5400:202:3000::4af/tcp/4001/p2p/12D3KooWRc4xyoRgW3mhn6dBxkFQC64iaBgCEzoZTUTog5geNupw/p2p-circuit/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N","/ip6/2606:5400:202:3000::4af/udp/4001/quic/p2p/12D3KooWRc4xyoRgW3mhn6dBxkFQC64iaBgCEzoZTUTog5geNupw/p2p-circuit/p2p/12D3KooWMb1C7CBkXDcm3hKZwkxYp9wsJgALGfTZqk6BBbKUyn4N"]
```

**Note** you will have to use the same shell now in order to start the pin service!

#### Starting the dev server

With `PINSERVICE_DELEGATES` defined and RabbitMQ available on localhost (as you would when running the crawler), you can start a dev server with:

`npm run dev`

## Configuration

The API can be configured through the following environment variables:

- `PINSERVICE_DELEGATES`: a JSON array of [multiaddrs](http://docs.libp2p.io.ipns.localhost:8080/concepts/addressing/) which clients of the service will connect to.
- `PINSERVICE_PORT` Port to run the service on _(default: `7070`)_
- `PINSERVICE_HOST` Host to run the service on _(default: `localhost`)_
- `AMQP_URL` address of the ipfs-search queue server _(default: `amqp://guest:guest@localhost:5672`)_
- `NODE_ENV` turns off swagger UI when set to `production` _(default: `development`)_
- `PROCESSES` amount of sibling workers in cluster _(default: `1`)_

## Usage

### Authentication

For now, authentication has been disabled. Nonetheless, the ipfs client expects an authentication key and won't work without one. You can use anything, but not nothing.

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
