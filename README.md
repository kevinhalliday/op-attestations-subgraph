# op-attestations-subgraph

Subgraph for Optimism's Attestation Station


This subgraph just tracks AttestationCreated events from the AttestationStation.
To enable pagination through all attestations, by address, key, or both, we also track attestation counts and indicies.

To query for all attestations, in order


``` graphql
query {
    attestations(
      orderBy: index,
      orderDirection: desc,
      first: numRows,
      where: {
        index_lte: start,
      },
    ) {
        id
        about
        creator
        key
    }
}
```

To query by key:


``` graphql
query {
    attestations(
      orderBy: index,
      orderDirection: desc,
      first: numRows,
      where: {
        and: [
          { indexForKey_lte: start },
          { key: key },
        ],
      },
    ) {
        id
        about
        creator
        key
    }
}
```

To query by address:

``` graphql
query {
    attestations(
      orderBy: index,
      orderDirection: desc,
      first: numRow>,
      where: {
        or: [
          { about: address, indexForAbout_lte: start },
          { creator: address, indexForCreator_lte: start },
        ],
    ) {
        id
        about
        creator
        key
    }
}
```

Or both

``` graphql
query {
    attestations(
      orderBy: index,
      orderDirection: desc,
      first: numRow>,
      where: {
        or: [
          { about: address, indexForAbout_lte: start, key: key },
          { creator: address, indexForCreator_lte: start, key: key },
        ],
    ) {
        id
        about
        creator
        key
    }
}
```


## Local Development

Follow directions at https://thegraph.academy/developers/local-development/
