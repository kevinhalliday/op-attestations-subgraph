import { AttestationCreated as AttestationCreatedEvent } from "../generated/AttestationStation/AttestationStation"
import { Attestation } from "../generated/schema"

export function handleAttestationCreated(event: AttestationCreatedEvent): void {
  let attestation = new Attestation(
    event.transaction.hash
      .toHex()
      .concat('-')
      .concat(event.logIndex.toString()),
  )

  attestation.creator = event.params.creator
  attestation.about = event.params.about
  attestation.key = event.params.key
  attestation.val = event.params.val

  attestation.blockNumber = event.block.number
  attestation.blockTimestamp = event.block.timestamp
  attestation.transactionHash = event.transaction.hash

  attestation.save()
}
