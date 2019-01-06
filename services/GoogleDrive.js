import creds from 'Common/creds'
import error from 'Common/error'

const apiKey = creds.drive.apiKey
const client_id = creds.oauth.clientId
const scope = 'https://www.googleapis.com/auth/drive'
let auth2

function authenticate(onSigninChange) {

    function initAuth() {
        gapi.client.setApiKey(apiKey)
        gapi.auth2.init({ client_id, scope})
            .then(function onInit () {
                auth2 = gapi.auth2.getAuthInstance()
                onSigninChange({ signedIn: auth2.isSignedIn.get(), error: null })
            })
            .catch(function onError(e) {
                onSigninChange({signedIn: false, error: e})
            })

    }

    try {
        gapi.load('auth2', initAuth)
    } catch(e) {
        error('loading Google OAuth2', e)
    }
}

function signIn() {
    return auth2.signIn()
}

function signOut(event) {
    return auth2 ? auth2.signOut() : Promise.resolve()
}

function sync(content, id) {
  // problem: if i sync from one device, and cache that id file 
  // but then sync from another device, it will also create a new file
  // but neither will sync.  best to take newest file matching fn pattern, if no id.
  return gapi.client.load('drive', 'v2')
    .then(() => {

      // no file id, look for newest file or save current content to a sync file
      if (!id) {
        console.log('no file id saved, so looking for newest sync file in g drive')
        return getNewestSyncFileId()
          .then(({ id }) => {
            if (id) { 
              console.log('found a file by id in g drive: ', id)
              return getFileById(id).then(content => ({ id, content }))
            } else {
              console.log('didnt find a file by id in g drive, saving current content there')
              return saveFile(content)
                .then(
                  id => ({ id }), 
                  e => error('Saving File to Google Drive', e)
                )
            }
            })
      }

      // file id exists, so update sync file
      console.log('we have a cached sync file id, trying to locate that ...') 
      return getFileById(id)
        .then(content => {
          // file id not in google drive, so save current content there.
          if (!content) {
            console.log('nothing found, so saving current content to g drive api')
            return saveFile(content).then(
                id => ({ content, id }), 
                e => error('Saving File to Google Drive', e)
            )
          }
          // file found, return id and content
          console.log('found a sync file, using that')
          return { id, content }
        })
    })
} 

function getFileById(fileId) {
    return gapi.client.drive.files
      .get({ fileId, alt: 'media' })
        .then(
          ({ result, body }) => body, // error code 200
          e => error('Getting file by id: ', e) // error code !== 200, body is error msg
        )
      // if no file exists, call getNewestSyncFile
      // and if that returns nothing
      // create a new File
}

function getNewestSyncFileId() {
    return gapi.client.drive.files
        .list({ 
          q: 'title="no-task-sync-file.json"', 
          orderBy: 'modifiedDate desc,title' 
        })
        .then(({ result }) => result.items[0])// ? getFileById(result.items[0].id)() : null)
}

function saveFile(fileData) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsBinaryString(new Blob([fileData], { type: 'text/plain' }))
      reader.onload = function(e) {
        resolve(reader.result)
      }
    })
    .then(result => {
          const boundary = '-------314159265358979323846'
          const delimiter = "\r\n--" + boundary + "\r\n"
          const close_delim = "\r\n--" + boundary + "--"
          const contentType = fileData.type || 'application/octet-stream'
          const metadata = {
              'title': 'no-task-sync-file.json',
              'mimeType': contentType
          }

          const base64Data = btoa(result)
          const multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim

          return gapi.client.request({
              path: '/upload/drive/v2/files',
              method: 'POST',
              params: {uploadType: 'multipart'},
              headers: {
                  'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
              },
              body: multipartRequestBody
          })
          .then(({ result }) => result.id)
    })
}

export default {
    authenticate,
    signIn,
    signOut,
    sync,
}
