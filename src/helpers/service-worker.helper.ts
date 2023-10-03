export const registerWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    return registration
  }
}
