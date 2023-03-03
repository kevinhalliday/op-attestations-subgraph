import { newMockEvent } from 'matchstick-as'
import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
} from 'matchstick-as/assembly/index'
import { ethereum, Address, Bytes } from '@graphprotocol/graph-ts'
import { handleAttestationCreated } from '../src/attestations'
import { AttestationCreated } from '../generated/AttestationStation/AttestationStation'

function createAttestationCreatedEvent(
  creator: Address,
  about: Address,
  key: Bytes,
  val: Bytes,
): AttestationCreated {
  let attestationCreatedEvent = changetype<AttestationCreated>(newMockEvent())

  attestationCreatedEvent.parameters.push(
    new ethereum.EventParam('creator', ethereum.Value.fromAddress(creator)),
  )
  attestationCreatedEvent.parameters.push(
    new ethereum.EventParam('about', ethereum.Value.fromAddress(about)),
  )
  attestationCreatedEvent.parameters.push(
    new ethereum.EventParam('key', ethereum.Value.fromFixedBytes(key)),
  )
  attestationCreatedEvent.parameters.push(
    new ethereum.EventParam('val', ethereum.Value.fromBytes(val)),
  )

  return attestationCreatedEvent
}

// TODO: add tests for counts and indices

describe('Describe entity assertions', () => {
  afterAll(() => {
    clearStore()
  })

  test('Attestation created and stored', () => {
    let creator = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    )
    let about = Address.fromString('0x0000000000000000000000000000000000000001')
    let key = Bytes.fromI32(1234567890)
    let val = Bytes.fromI32(1234567890)
    let event = createAttestationCreatedEvent(creator, about, key, val)
    let id = event.transaction.hash
      .toHex()
      .concat('-')
      .concat(event.logIndex.toString())

    handleAttestationCreated(event)

    assert.entityCount('Attestation', 1)
    assert.fieldEquals('Attestation', id, 'creator', creator.toHexString())
    assert.fieldEquals('Attestation', id, 'about', about.toHexString())
    assert.fieldEquals('Attestation', id, 'key', key.toHexString())
    assert.fieldEquals('Attestation', id, 'val', val.toHexString())
  })
})
