// 1. Buka kamera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    document.getElementById('video').srcObject = stream;
  });

// 2. Ambil foto
document.getElementById('snap').addEventListener('click', () => {
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');
  context.drawImage(document.getElementById('video'), 0, 0, 320, 240);
});

// 3. Upload ke Google Drive
document.getElementById('upload').addEventListener('click', () => {
  let canvas = document.getElementById('canvas');
  let dataURL = canvas.toDataURL('image/png');
  let blob = dataURItoBlob(dataURL);

  gapi.load("client:auth2", function() {
    gapi.auth2.init({
      client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com" // ganti dengan Client ID Anda
    });
    gapi.client.load("drive", "v3", function() {
      gapi.auth2.getAuthInstance().signIn().then(() => {
        var fileMetadata = { name: "foto_bukti_" + Date.now() + ".png" };
        var media = { mimeType: "image/png", body: blob };
        gapi.client.drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: "id"
        }).then(response => {
          alert("Foto berhasil diupload ke Google Drive! ID: " + response.result.id);
        });
      });
    });
  });
});

// Helper: ubah dataURL ke Blob
function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
