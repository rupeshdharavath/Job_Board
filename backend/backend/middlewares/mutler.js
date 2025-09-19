import multer from "multer";

const storage = multer.memoryStorage(); // or diskStorage with a destination

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const singleUpload = upload.single("file");
