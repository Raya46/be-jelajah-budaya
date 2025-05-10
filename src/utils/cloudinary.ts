import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const deleteCloudinaryImage = async (imageUrl: string) => {
  try {
    const parts = imageUrl.split("/");
    const publicIdWithFormat = parts.slice(-2).join("/");
    const publicId =
      publicIdWithFormat.substring(0, publicIdWithFormat.lastIndexOf(".")) ||
      publicIdWithFormat;

    if (!publicId) {
      console.error("Could not extract public_id from URL:", imageUrl);
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

export default cloudinary;
