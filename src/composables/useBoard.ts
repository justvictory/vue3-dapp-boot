import { ref } from 'vue'

const boardOpen = ref(false)

export function useBoard() {
  const openBoard = () => {
    boardOpen.value = true
  }
  const closeBoard = () => {
    boardOpen.value = false
  }

  return {
    boardOpen,
    openBoard,
    closeBoard,
  }
}
