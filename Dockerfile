FROM node:16-alpine AS build

WORKDIR /usr/src/app
COPY package*.json ./

# Install (all) dependencies
RUN npm ci

# Copy source, run build
COPY tsconfig*.json ./
COPY src ./src/

RUN npm run build

# Run image, without dev deps
FROM node:16-alpine
ENV NODE_ENV=production

WORKDIR /usr/src/app
RUN chown node:node .
USER node

# Install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled typescript
COPY --from=build /usr/src/app/lib ./lib/

EXPOSE 7070

ENV PINSERVICE_HOST=0.0.0.0

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:7070/healthcheck || exit 1

CMD ["start"]
ENTRYPOINT ["npm"]
