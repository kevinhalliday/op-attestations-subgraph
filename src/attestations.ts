import { BigInt } from '@graphprotocol/graph-ts'
import { AttestationCreated as AttestationCreatedEvent } from '../generated/AttestationStation/AttestationStation'
import { Attestation, Count } from '../generated/schema'

function countFor(id: string): Count {
  let c = Count.load(id)

  if (c == null) {
    c = new Count(id)
    c.count = BigInt.zero()
  }

  return c
}

const one = BigInt.fromI32(1)

export function handleAttestationCreated(event: AttestationCreatedEvent): void {
  let attestation = new Attestation(
    event.transaction.hash
      .toHex()
      .concat('-')
      .concat(event.logIndex.toString()),
  )

  let creator = event.params.creator
  let about = event.params.about
  let key = event.params.key

  attestation.creator = creator
  attestation.about = about
  attestation.key = key
  attestation.val = event.params.val
  attestation.blockNumber = event.block.number
  attestation.blockTimestamp = event.block.timestamp
  attestation.transactionHash = event.transaction.hash

  let globalCount = countFor('global')
  let creatorCount = countFor(creator.toHex())
  let aboutCount = countFor(about.toHex())
  let keyCount = countFor(key.toHex())
  let keyAndAboutCount = countFor(
    key
      .toHex()
      .concat('-')
      .concat(about.toHex()),
  )
  let keyAndCreatorCount = countFor(
    key
      .toHex()
      .concat('-')
      .concat(creator.toHex()),
  )

  // zero indexed
  attestation.index = globalCount.count
  attestation.indexForCreator = creatorCount.count
  attestation.indexForAbout = aboutCount.count
  attestation.indexForKey = keyCount.count
  attestation.indexForKeyAndAbout = keyAndAboutCount.count
  attestation.indexForKeyAndCreator = keyAndCreatorCount.count

  globalCount.count = globalCount.count.plus(one)
  creatorCount.count = creatorCount.count.plus(one)
  aboutCount.count = aboutCount.count.plus(one)
  keyCount.count = keyCount.count.plus(one)
  keyAndAboutCount.count = keyAndAboutCount.count.plus(one)
  keyAndCreatorCount.count = keyAndCreatorCount.count.plus(one)

  attestation.save()
  globalCount.save()
  creatorCount.save()
  aboutCount.save()
  keyCount.save()
  keyAndAboutCount.save()
  keyAndCreatorCount.save()
}
