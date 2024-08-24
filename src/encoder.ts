import { EncodableDeck } from './syntax'
import { CardRefQty } from './models'
import { BitstreamReader } from '@astronautlabs/bitstream';
import { Buffer } from 'buffer'

export function encodeList(list: string): string {
  const lines = list.split("\n")
  const cards: Array<CardRefQty> = lines.flatMap((ln) => {
    let match = ln.trim().match(/^(\d+) (\w+)$/)
    if (match) {
      return [{quantity: parseInt(match[1], 10), id: match[2]}]
    } else {
      return []
    }
  })

  const deck = EncodableDeck.fromList(cards)
  const buffer = deck.serialize()
  return Buffer.from(buffer).toString('base64')
}

export function decodeList(encoded: string): string {
  const bytes = Buffer.from(encoded, 'base64');
  let reader = new BitstreamReader();
  reader.addBuffer(bytes)
  const deck = EncodableDeck.decode(reader)
  const text = deck.asCardRefQty.map((cq) => `${cq.quantity} ${cq.id}`).join("\n")
  return text
}
