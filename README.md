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
* [ ] Automate the process of transcoding media for use with Jellyfin
    * [x] Transcoding operations in Handbrake
    * [ ] Queuing these operations in a web UI
* [ ] Have a simple auth system such that only authorized users can modify the
      encoding queue.
    * As this project is intended for home use, the auth will be extremely
      simple.

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

## Configuration

The YAML file at the path `$TRANSCODED_CONFIG` will be loaded as the main
configuration.

```yaml
# List of media libraries to scan
libraries:
  -
    # Each library has a display name
    name: 'My movies'
    # A path to the staging directory. This is where you should place
    # full-quality rips of your media.
    staging: '/media/movies/staging'
    # A path to the production directory. This is where Transcoded will place
    # encodings of your media
    production: '/media/movies/production'
  # You can have multiple libraries
  - name: 'My TV shows'
    staging: '/media/shows/staging'
    production: '/media/shows/production'
# Path to the presets directory
presets: '/presets'
```

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
  should be placed in [square brackets].

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

The project is not in a state where I have tried setting this up yet.
Eventually, I plan for this to be dockerized.

```sh
$ bun run build
```
