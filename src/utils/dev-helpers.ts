export const clearCache = () => {
  if (process.env.NODE_ENV === 'development') {
    localStorage.clear()
    console.log('Cache cleared')
    window.location.reload()
  }
} 