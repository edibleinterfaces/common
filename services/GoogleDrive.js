import creds from 'Common/creds'

function GoogleDrive() {

    const apiKey = creds.drive.apiKey;
    const client_id = creds.oauth.clientId;
    const scope = 'https://www.googleapis.com/auth/drive';

    let auth2;

    function authenticate(onSigninChange) {

        function initAuth() {
            gapi.client.setApiKey(apiKey);
            gapi.auth2.init({ client_id, scope})
                .then(function onInit () {
                    auth2 = gapi.auth2.getAuthInstance();
                    onSigninChange({ signedIn: auth2.isSignedIn.get(), error: null });
                })
                .catch(function onError(e) {
                    onSigninChange({signedIn: false, error: e});
                });

        }

        try {
            gapi.load('auth2', initAuth);
        } catch(e) {
            console.warn(e);
        }
    }

    function signIn() {
        return auth2.signIn();
    }

    function signOut(event) {
        return auth2.signOut();
    }

    function saveFile(file) {
        gapi.client.load('drive', 'v2', function() {
            _saveFile(file);
        });
    } 

    function _saveFile(fileData, callback) {

        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {

            const contentType = fileData.type || 'application/octet-stream';
            const metadata = {
                'title': fileData.name,
                'mimeType': contentType
            };

            const base64Data = btoa(reader.result);
            const multipartRequestBody =
                  delimiter +
                  'Content-Type: application/json\r\n\r\n' +
                  JSON.stringify(metadata) +
                  delimiter +
                  'Content-Type: ' + contentType + '\r\n' +
                  'Content-Transfer-Encoding: base64\r\n' +
                  '\r\n' +
                  base64Data +
                  close_delim;

            const request = gapi.client.request({
                'path': '/upload/drive/v2/files',
                'method': 'POST',
                'params': {'uploadType': 'multipart'},
                'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody
            });

            if (!callback) {

                callback = function(err) {
                    if (err) {
                        console.warn(err);
                    } 
                };
                
            }

            request.execute(callback);
        };
    }

    return {
        authenticate,
        signIn,
        signOut,
        saveFile,
    };
}

export default GoogleDrive;
