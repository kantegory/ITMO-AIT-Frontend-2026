import { Modal } from 'bootstrap'

const useModal = (id) => {
  const getInstance = () => Modal.getOrCreateInstance(document.getElementById(id))

  const show = () => getInstance().show()
  const hide = () => getInstance().hide()

  return { show, hide }
}

export default useModal
