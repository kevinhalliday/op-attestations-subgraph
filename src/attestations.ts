import { BigInt } from '@graphprotocol/graph-ts'
import { AttestationCreated as AttestationCreatedEvent } from '../generated/AttestationStation/AttestationStation'
import { Attestation, Global } from '../generated/schema'

function global(): Global {
  let g = Global.load('global')

  if (g == null) {
    g = new Global('global')
    g.count = BigInt.zero()
  }

  return g
}


export function handleAttestationCreated(event: AttestationCreatedEvent): void {
  let attestation = new Attestation(
    event.transaction.hash
      .toHex()
      .concat('-')
      .concat(event.logIndex.toString()),
  )

  let g = global()

  attestation.creator = event.params.creator
  attestation.about = event.params.about
  attestation.key = event.params.key
  attestation.val = event.params.val

  // zero indexed
  attestation.index = g.count
  g.count = g.count.plus(BigInt.fromI32(1))

  attestation.blockNumber = event.block.number
  attestation.blockTimestamp = event.block.timestamp
  attestation.transactionHash = event.transaction.hash

  attestation.save()
  g.save()
}
