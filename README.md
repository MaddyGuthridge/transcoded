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

* [ ] Manage my staging and production media libraries
    * [x] Detect media in staging and production media libraries
    * [x] Use media library structure to determine how media has been transcoded
          (ie resolutions)
    * [x] Determine the "main feature" of a media entry
    * [ ] Display this information in a web UI
* [ ] Automate the process of transcoding media for use with Jellyfin
    * [ ] Transcoding operations in Handbrake
    * [ ] Queuing these operations in a web UI
* [ ] Have a simple auth system such that only authorized users can modify the
      encoding queue.
    * As this project is intended for home use, the auth will be extremely 
      simple.

## Additional notes

* While Jellyfin supports external subtitle and audio tracks, supporting them is
  very tedious, and so this library intentionally does not support extracting
  them. Instead, you should set up your Handbrake presets to include subtitle
  tracks from the originals. I recommend encoding to the
  [`.mkv`](https://en.wikipedia.org/wiki/Matroska) format, which has excellent
  support for alternate audio and subtitle tracks. Remuxing to `.mp4` does not
  require significant resources, and so as long as the contained video is in a
  good format, Jellyfin will have no troubles streaming media in this format to
  clients.

## Developing

Using the [`bun`](https://bun.com/) package manager in JS.

### Install dependencies

```sh
$ bun install
```

### Run the dev server

```sh
$ bun run dev
```

### Run the test suite

```sh
$ bun test
```

### Build for production

The project is not in a state where I have tried setting this up yet.

```sh
$ bun run build
```
