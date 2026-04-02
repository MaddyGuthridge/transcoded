# Jellybake

Jellybake is a media library manager which allows users to encode multiple
versions of their high resolution media (eg Blu-ray rips) to streaming-friendly
versions.

## Terminology

***Library*** -- a collection of media. Contains media items. The original media
is kept in a staging directory, and encoded versions are kept in a production
directory.

***Media item*** -- a single movie or TV show season, including any special
features.

***Media file*** -- a single file from a media item, for example a single
episode of a TV series, or the main feature of a movie.

***Staging directory*** -- a directory containing original full-quality media
items. Media items within the staging directory can be queued for encoding.

***Production directory*** -- a directory containing encoded media items. The
path to a media item within the production directory should match the
corresponding path within the staging directory.

***Job queue*** -- the list of tasks for Jellybake to complete. In the interest
of simplicity, Jellybake only works on one item at once. This is to avoid race
conditions.
