<template>
  <v-container class="fill-height">
    <!-- <div class="text-center">Your Turn</div> -->
    <v-wait-sign @up="TIME_UP()" :isYourTurn="isYourTurn"></v-wait-sign>

    <the-playground></the-playground>
    <v-dialog :value="victoryOrDefeat" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ text }}</v-card-text>
        <v-card-actions>
          <v-btn @click="onExit">
            <v-icon left>mdi-exit-to-app</v-icon>exit</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="onClick" color="green darken-1"
            ><v-icon left>mdi-sword-cross</v-icon>try again</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :value="!isYourTurn">
      <v-turn></v-turn>

      <v-btn @click="onClickLose" fixed bottom left color="indigo"
        >Surrender
        <v-icon rigth>mdi-handshake</v-icon>
      </v-btn>
    </v-overlay>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VTurn from '~/components/atoms/VTurn'

import VWaitSign from '~/components/molecules/VWaitSign'
import ThePlayground from '~/components/organisms/ThePlayground'
export default {
  layout: 'playroom',

  components: {
    ThePlayground,
    VWaitSign,
    VTurn
  },

  computed: {
    ...mapGetters('game', ['turnPlayer']),
    ...mapGetters('modal', ['isOpened']),
    ...mapGetters('player', ['isYourTurn', 'victoryOrDefeat']),

    title() {
      switch (this.victoryOrDefeat) {
        case 'WIN':
          return `Win!`
        case 'DRAW':
          return `Draw`
      }
      return `Lose...`
    },

    text() {
      switch (this.victoryOrDefeat) {
        case 'WIN':
          return `You are the winner.`
        case 'DRAW':
          return `You played a fun game`
      }
      return `You are still a loser.`
    }
  },

  created() {
    this.bindPlayroomRef()
    this.bindGameRef()
  },

  methods: {
    ...mapActions('modal', ['HIDE']),
    ...mapActions('game', ['RESTART', 'NEXT_GAME', 'bindGameRef', 'TIME_UP']),
    ...mapActions('playroom', ['bindPlayroomRef']),
    ...mapActions('player', ['SURRENDER', 'LEAVE_ROOM']),

    onClick() {
      this.NEXT_GAME()
      this.HIDE(1)
    },

    onExit() {
      this.HIDE(1)
      this.LEAVE_ROOM()
      this.$router.push('/playrooms')
    },

    onClickLose() {
      this.SURRENDER()
    }
  }
}
</script>

<style scoped></style>
