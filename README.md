# Transcoded

A video transcoding manager for home media servers.

Allows for managing your media library using a simple web interface.

## Goals

This project is a work in progress.

* [ ] Manage my staging and production media libraries
    * [x] Detect media in staging and production media libraries
    * [x] Use media library structure to determine how media has been transcoded
          (ie resolutions)
    * [x] Determine the "main feature" of a media entry.
    * [ ] Detect extracted subtitles in production library
    * [ ] Detect additional available subtitles in staging library
    * [ ] Display this information in a front-end
* [ ] Automate the process of transcoding media for use with Jellyfin, queuing:
    * [ ] Transcoding operations in Handbrake
    * [ ] Extracting subtitle tracks from MKV files

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
