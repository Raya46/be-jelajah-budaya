import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

interface CloudinaryParams {
  folder: string;
  allowed_formats?: string[];
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "jelajah-budaya",
    allowed_formats: ["jpg", "png", "jpeg"],
  } as CloudinaryParams,
});

const upload = multer({ storage: storage });

export default upload;
