import { db } from './firestore'
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { recipientStatus } from '../../consts/constants'
import { makeId } from '../../utils/random/random'
import { Recipient } from '../../types/recipient'

export const getRecipientByLineId = async (lineId: string) => {
  let recipient = undefined
  ;(
    await db
      .collection('recipients')
      .where('lineId', '==', lineId)
      .withConverter<Recipient>(recipientConverter)
      .get()
  ).forEach((doc) => {
    recipient = doc.data()
  })
  return recipient as Recipient | undefined
}

const recipientConverter = {
  toFirestore(recipient: Recipient): DocumentData {
    return {
      id: recipient.id,
      recipientGroupId: recipient.recipientGroupId,
      lineId: recipient.lineId,
      name: recipient.name,
      status: recipient.status,
      enable: recipient.enable,
      createdAt: recipient.createdAt,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Recipient {
    const data = snapshot.data()!
    return {
      id: data.id,
      recipientGroupId: data.recipientGroupId,
      lineId: data.lineId,
      name: data.name,
      status: data.status,
      enable: data.enable,
      createdAt: data.createdAt.toDate(),
    }
  },
}

export const createRecipient = async (lineId: string) => {
  const newRecipient: Recipient = {
    id: `r-${makeId(4)}`,
    recipientGroupId: '',
    lineId: lineId,
    name: '',
    status: recipientStatus.NONE,
    enable: false,
    createdAt: new Date(),
  }
  updateRecipient(newRecipient)
  console.info(`create new recipient${newRecipient}`)
  return newRecipient
}
export const updateRecipient = async (recipient: Recipient) => {
  await db.collection('recipients').doc(recipient.id).set(recipient)
}
