import { defineStore } from 'pinia'

export const useContent = defineStore('content', {
  state: () => {
    return {
      data: {},
      sdk: null
    }
  },
  actions: {
    update(prop, newValue) {
      this[prop] = newValue
    }
  }
});