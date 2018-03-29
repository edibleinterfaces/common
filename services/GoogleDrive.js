function googleDrive(creds) {

    const apiKey = creds.drive.apiKey;
    const client_id = creds.oauth.clientId;
    const scope = 'https://www.googleapis.com/auth/drive';
    let isSignedIn = false;

    let auth2;
    authenticate();

    function authenticate() {
        try {
            gapi.load('auth2', initAuth);
        } catch(e) {
            console.warn(e);
        }
    }

    function initAuth() {
        gapi.client.setApiKey(apiKey);
        gapi.auth2.init({ client_id, scope}).then(function onInit () {
            auth2 = gapi.auth2.getAuthInstance();
        },
        function onError(e) {
            throw new Error(e);
        });

    }

    function handleAuthClick(event) {
        if (auth2.getAuth
        return auth2.signIn();
    }

    function handleSignoutClick(event) {
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
        handleAuthClick,
        handleSignoutClick,
        saveFile,
        isSignedIn
    };
}

export default googleDrive;
