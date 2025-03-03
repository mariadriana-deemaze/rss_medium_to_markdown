# RSS Medium to markdown action

A GitHub action that performs a fetch to a provided medium feed URL, extracts and parses it's data onto markdown documents.

_Heavily inspired by this [other]('https://github.com/keiranlovett/rss-feed-to-markdown') more generalist repository._


### Input
- medium_feed_url<string>: The Medium feed RSS address

## Run
```bash
$ node --loader ts-node/esm src/index.ts https://medium.com/feed/@<some_handle>
```