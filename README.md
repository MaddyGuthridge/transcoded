# Transcoded

A video transcoding manager for home media servers.

Essentially, this tool allows you to have a "staging" library, where you keep
full-quality rips of your media, and a "production" library which is what your
media server accesses.

## Similar projects

* [Tdarr](https://home.tdarr.io/): way larger feature scope, but closed-source.
  Probably far more powerful than I personally need.
* [Handbrake Web](https://github.com/TheNickOfTime/handbrake-web): only supports
  the encoding queue, meaning there is no reliable system to check what
  has/hasn't been encoded.

## Goals

This project is a work in progress.

* [x] Manage my staging and production media libraries
    * [x] Detect media in staging and production media libraries
    * [x] Use media library structure to determine how media has been transcoded
          (ie resolutions)
    * [x] Determine the "main feature" of a media entry
    * [x] Display this information in a web UI
    * [x] Rescan the library on file system changes, and job status changes
* [x] Automate the process of transcoding media for use with Jellyfin
    * [x] Transcoding operations in Handbrake
    * [x] Queuing these operations in a web UI
    * [x] Live-update the queue
* [ ] Have a simple auth system such that only authorized users can modify the
      encoding queue.
    * As this project is intended for home use, the auth will be extremely
      simple.
* [ ] A nice UI
    * Currently it is un-styled HTML
    * And many quality-of-life features are missing, such as the ability to
      cancel jobs and have the library list update to show the progress of jobs

## Additional notes

* While Jellyfin supports external subtitle and audio tracks, supporting them is
  very tedious, and so this tool intentionally does not support extracting
  them. Instead, you should set up your Handbrake presets to include subtitle
  tracks from the originals. I recommend encoding to the
  [`.mkv`](https://en.wikipedia.org/wiki/Matroska) format, which has excellent
  support for alternate audio and subtitle tracks. Remuxing to `.mp4` does not
  require significant resources, and so as long as the contained video is in a
  good format, Jellyfin will have no troubles streaming media in this format to
  clients.

## Deploying

Using Docker Compose

```yml
# Transcoded
# Example docker-compose.yml
services:
  transcoded:
    image: maddyguthridge/transcoded

    hostname: transcoded
    user: 1000:1000
    restart: always
    ports:
      - 0.0.0.0:5030:3000/tcp
    volumes:
      - "./config:/config"
      - type: bind
        source: "/mnt/maddyflix"
        target: "/media"

    environment:
      TRANSCODED_CONFIG: "/config/config.yaml"
      HOST: 0.0.0.0
      PORT: 3000
```

Refer to `docker-compose.yaml` for an example which is built from source.

## Configuration

The YAML file at the path `$TRANSCODED_CONFIG` will be loaded as the main
configuration.

See `config.example.yaml` for an example configuration.

### Preset file structure

The presets directory should contain JSON Handbrake presets. To create a preset
file, create it in the Handbrake GUI, then choose `Presets` >
`Export preset...`. Notably, the preset name will be used in the name of the
transcoded media file, so making it something Jellyfin can parse is useful (eg
a resolution such as `1080p`).

### Media structure

* Transcoded searches for media files by walking the staging directory structure
* Any directory that has an immediate child that is a media file is considered
  a single media item.
* Media items can have multiple media files (eg special features), but has a
  maximum of one main feature.
* A media file is considered to be the main feature if it has the string
  `Main Feature` in its filename, or if it is the only file at the top level of
  the media item directory.
* For each media file, the equivalent location in the production library is
  scanned for encodings using the discovered Handbrake presets. The preset name
  should be placed in `[` square brackets `]`.

## Developing

Using the [`bun`](https://bun.com/) package manager in JS.

### Install CLI dependencies

* `HandBrakeCLI` -- to run transcoding operations
* `mkvmerge` -- to extract metadata for media

### Install JS dependencies

```sh
$ bun install
```

### Run the dev server

```sh
$ bun run dev
```

### Test, lint and type-check

```sh
$ bun test
$ bun lint
$ bun check
```

### Build for production

```sh
$ docker build .
```
