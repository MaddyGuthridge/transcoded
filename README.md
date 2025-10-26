# Transcoded

A video transcoding manager for home media servers.

Allows for managing your media library using a simple web interface.

## Goals

This project is a work in progress.

* [ ] Manage my staging and media libraries
    * [ ] Detect media in staging and media libraries
    * [ ] Use media library structure to determine how media has been transcoded
      (ie resolutions)
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

### Build for production

The project is not in a state where I have tried setting this up yet.

```sh
$ bun run build
```
