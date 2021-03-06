import { firestoreAction } from 'vuexfire'
import { SUBSCRIBE, CREATE, ADD_ID } from './mutation-types'
import firebase, { firestore } from '~/plugins/firebase'

const collectionName = 'playrooms'
const timestamp = firebase.firestore.FieldValue.serverTimestamp()
const INIT_VALUE = {
  history: [
    {
      squares: Array(9).fill(null)
    }
  ],
  timestamp,
  readyPlayers: ['PLAYER_1']
}
const firstGameNum = '1'

function collectionRef() {
  return firestore.collection(collectionName)
}

export default {
  bindPlayroomsRef: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef(
      collectionName,
      collectionRef().where('isClose', '==', false)
    )
  }),

  bindPlayroomRef: firestoreAction(({ bindFirestoreRef, getters }) => {
    bindFirestoreRef('playroom', collectionRef().doc(getters.id))
  }),

  [SUBSCRIBE]({ dispatch }) {
    dispatch('bindPlayroomsRef')
  },

  async [CREATE]() {
    const docRef = await collectionRef().add({
      timestamp,
      isClose: false
    })

    docRef
      .collection('games')
      .doc(firstGameNum)
      .set({ ...INIT_VALUE })
      .catch((error) => {
        console.error('Error adding document: ', error)
      })
    return docRef
  },

  async ENTER({ dispatch }, payload) {
    const playroomId = payload
    await dispatch(ADD_ID, playroomId)
    dispatch('fluctuatePlayers', 'ENTER')
  },

  ADD_ID({ commit }, payload) {
    commit(ADD_ID, payload)
  },

  fluctuatePlayers({ getters }, payload) {
    const id = getters.id
    if (!id) return

    const fluctuation = payload === 'ENTER' ? 1 : -1
    collectionRef()
      .doc(id)
      .update({ players: firebase.firestore.FieldValue.increment(fluctuation) })
  }
}
