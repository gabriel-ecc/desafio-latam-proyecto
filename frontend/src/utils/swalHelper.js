import Swal from 'sweetalert2'

// Este es tu mixin base con la configuración común
const ToastMixin = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: '450px',
  didOpen: toast => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  }
})

// Función que genera un Toast dinámicamente
export const toast = ({ icon = 'success', title }) => {
  let customClass

  switch (icon) {
    case 'success':
      customClass = 'toast-success-container'
      break
    case 'error':
      customClass = 'toast-error-container'
      break
    case 'warning':
      customClass = 'toast-warning-container'
      break
    case 'info':
      customClass = 'toast-info-container'
      break
    default:
      customClass = 'toast-info-container'
      break
  }
  
  ToastMixin.fire({
    icon,
    title,
    customClass: {
      popup: customClass
    }
  })
}
