# We need full debiant to get a newer version of handbrake
FROM debian:stable AS base
RUN apt update
RUN apt install -y curl unzip
RUN curl -fsSL https://bun.com/install | bash
RUN cp "/root/.bun/bin/bun" "/usr/bin/bun"
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY vite.config.ts tsconfig.json package.json bun.lock svelte.config.js ./
COPY src src
COPY static static

# [optional] tests & build
ENV NODE_ENV=production
RUN bun run prepare
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
RUN apt install -y handbrake-cli

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build build
COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "build/index.js" ]
