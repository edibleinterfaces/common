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
    return auth2.signOut()
}

function sync(content, id) {
  // assumption is that the server has the most up-to-date sync content

  // potential issue: we're assuming only one sync file.  is it possible for
  // more to unintentionally get created?
  // better to forget storing the file and always look for most recently
  // created file?

  // logic below:
  // if we fileId exists in vuex/local storage, get that file from drive
  // otherwise create a new notask sync file, store id in vuex/local storage
  return gapi.client.load('drive', 'v2')
    .then(() => {

      // no file id, so save current content to new sync file
      if (!id)
        return saveFile(content).then(
            id => ({ content, id }), 
            e => error('Saving File to Google Drive', e)
        )

      // file id exists, so update sync file
      return getFileById(id)
        .then(content => {
          // file id not in google drive, so save to 
          if (!content)
            return saveFile(content).then(
                id => ({ content, id }), 
                error('Saving File to Google Drive', e)
            )
          return { id, content }
        })
    })
} 

function getFileById(fileId) {
    return gapi.client.drive.files
      .get({ fileId, alt: 'media' })
        .then(
          ({ result }) => result.body, // error code 200
          e => error('Getting file by id: ', e) // error code !== 200, body is error msg
        )
      // if no file exists, call getNewestSyncFile
      // and if that returns nothing
      // create a new File
}

function getNewestSyncFileId() {
    console.log('getting newest sync file: ') 
    return gapi.client.drive.files
        .list({ 
          q: 'title="no-task-sync-file.json"', 
          orderBy: 'modifiedDate desc,title' 
        })
        .then(({ result }) => result.items[0] ? getFileById(result.items[0].id)() : null)
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
