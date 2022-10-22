FROM node:16-buster-slim AS build

RUN apt-get update && apt-get -y dist-upgrade
RUN apt-get install -y build-essential python3

WORKDIR /src
COPY ./package* ./

RUN npm ci --only=production

# This results in a single layer image
FROM node:16-buster-slim

RUN apt-get update && apt-get -y dist-upgrade
RUN apt-get install -y curl

WORKDIR /src
COPY --from=build /src .
COPY . .

EXPOSE 7070
USER node
ENV PINSERVICE_PORT=7070
ENV PINSERVICE_HOST=0.0.0.0

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:7070/healthcheck || exit 1

CMD ["start"]
ENTRYPOINT ["npm"]
