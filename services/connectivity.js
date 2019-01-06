export default function(store) {

  return {

    init: function() {
      window.addEventListener('online', () => {
        console.log('online')
        store.commit('updateConnectivityStatus', true)
      })
      window.addEventListener('offline', () => {
        console.log('offline')
        store.commit('updateConnectivityStatus', false)
      })
    },
    destroy: function () {
      window.removeEventListener('online', store.commit('updateConnectivityStatus', true))
      window.removeEventListener('offline', store.commit('updateConnectivityStatus', false))
    }

  }

}
