import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 } from 'uuid';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const firebaseConfig = {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID,
      };

      initializeApp(firebaseConfig);
      const storage = getStorage();

      const fileName = v4() + '.jpg';
      const storageRef = ref(storage, `${folder}/${fileName}`);

      const metadata = {
        contentType: file.mimetype,
      };

      const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;

      //-----------------------------------------------------------
      // console.log(file.mimetype);
      // const fileName = v4() + '.jpg';
      // const filePath = path.resolve(__dirname, '..', '..', `static/${folder}`);
      // if (!fs.existsSync(filePath)) {
      //   fs.mkdirSync(filePath, { recursive: true });
      // }
      // fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      // return fileName;
    } catch (e) {
      console.log(e);

      throw new InternalServerErrorException('Ошибка при записи файла');
    }
  }

  async clearStaticFolder(images: string[], folder: string) {
    try {
      const filePath = path.resolve(__dirname, '..', '..', `static/${folder}`);
      fs.readdir(filePath, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          const isExist = images.includes(file);

          if (!isExist) {
            fs.unlinkSync(path.join(filePath, file));
          }
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при удалении файлов');
    }
  }
}
