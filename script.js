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

  // Ambil catatan dari input
  let note = document.getElementById('note').value.trim();
  if (note === "") note = "tanpa_catatan";

  // Nama file dengan timestamp + catatan
  let fileName = "foto_bukti_" + Date.now() + "_" + note + ".png";

  gapi.load("client:auth2", function() {
    gapi.auth2.init({
      client_id: "928691431108-6bkm4ml6d0jric5nk2ppkf98e091v7kp.apps.googleusercontent.com" // ganti dengan Client ID Anda
    });
    gapi.client.load("drive", "v3", function() {
      gapi.auth2.getAuthInstance().signIn().then(() => {
        var fileMetadata = { 
          name: fileName,
          parents: ["https://drive.google.com/drive/folders/1mdg3uA8NFs8c8yx-KqGLaVD245B28Tu0"] // ganti dengan ID folder Drive tujuan
        };
        var media = { mimeType: "image/png", body: blob };
        gapi.client.drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: "id"
        }).then(response => {
          alert("Foto berhasil diupload ke folder Drive! ID: " + response.result.id);
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
