import { ref } from 'vue'

const boardOpen = ref(false)
const boardOpenConnecting = ref(false)

export function useBoard() {
  const openBoard = () => {
    boardOpen.value = true
  }
  const closeBoard = () => {
    boardOpen.value = false
  }
  const openConnectingBoard = () => {
    boardOpenConnecting.value = true;
  }
  const closeConnectingBoard = () => {
    boardOpenConnecting.value = false;
  }
  return {
    boardOpen,
    openBoard,
    closeBoard,
    boardOpenConnecting,
    openConnectingBoard,
    closeConnectingBoard
  }
}
