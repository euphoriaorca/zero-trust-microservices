import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const uploadTask = (file, setProgress, user) =>
  new Promise((res, rej) => {
    const storage = getStorage();
    const storageRef = ref(storage, `candidate/${user.id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progress));
        // eslint-disable-next-line default-case
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // eslint-disable-next-line default-case
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log('unauthorized', error.message);
            rej(error);
            break;
          case 'storage/canceled':
            // User canceled the upload
            rej(error);
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            console.log('storage unknonw', error.message);
            rej(error);
            break;

          default:
            console.log('upload error', error);
        }
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        res(downloadUrl);
      }
    );
  });
