# ipfs-search-queue-pinservice

[![pipeline status](https://gitlab.com/ipfs-search.com/ipfs-search-queue-pinservice/badges/main/pipeline.svg)](https://gitlab.com/ipfs-search.com/ipfs-search-queue-pinservice/-/commits/main)
[![Maintainability](https://api.codeclimate.com/v1/badges/1ddbaa055695043c60e2/maintainability)](https://codeclimate.com/github/ipfs-search/ipfs-search-queue-pinservice/maintainability)
[![Backers on Open Collective](https://opencollective.com/ipfs-search/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/ipfs-search/sponsors/badge.svg)](#sponsors)

Microservice implementing the [IPFS pin service API](https://ipfs.github.io/pinning-services-api-spec/) to push IPFS updates onto [ipfs-search search'](https://github.com/ipfs-search/ipfs-search) crawler queue.

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

## Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/ipfs-search/ipfs-search-queue-pinservice/graphs/contributors"><img src="https://opencollective.com/ipfs-search/contributors.svg?width=890&button=false" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/ipfs-search#backer)]

<a href="https://opencollective.com/ipfs-search#backers" target="_blank"><img src="https://opencollective.com/ipfs-search/backers.svg?width=890"></a>

## Sponsors

<a href="https://nlnet.nl/project/IPFS-search/"><img width="200pt" src="https://nlnet.nl/logo/banner.png"></a> <a href="https://nlnet.nl/project/IPFS-search/"><img width="200pt" src="https://nlnet.nl/image/logos/NGI0_tag.png"></a>
<br>
ipfs-search is supported by NLNet through the EU's Next Generation Internet (NGI0) programme.

<a href="https://redpencil.io/projects/"><img width="270pt" src="https://raw.githubusercontent.com/redpencilio/frontend-redpencil.io/327318b84ffb396d8af6776f19b9f36212596082/public/assets/vector/rpio-logo.svg"> </a><br>
RedPencil is supporting the hosting of ipfs-search.com.

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/ipfs-search#sponsor)]

<a href="https://opencollective.com/ipfs-search/sponsor/0/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/ipfs-search/sponsor/1/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/ipfs-search/sponsor/2/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/ipfs-search/sponsor/3/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/ipfs-search/sponsor/4/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/ipfs-search/sponsor/5/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/ipfs-search/sponsor/6/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/ipfs-search/sponsor/7/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/ipfs-search/sponsor/8/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/ipfs-search/sponsor/9/website" target="_blank"><img src="https://opencollective.com/ipfs-search/sponsor/9/avatar.svg"></a>
