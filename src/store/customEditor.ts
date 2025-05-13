import { defineStore } from 'pinia'

export const useEditor = defineStore('editor', {
  state: () => {
    return {
      form: {},
      isGenerated: false,
      generateText: ''
    }
  },
  actions: {
    update(prop, newValue) {
      this[prop] = newValue
    }
  }
});