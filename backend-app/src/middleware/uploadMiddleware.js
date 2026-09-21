import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage (files stored in RAM as buffer)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Uploads a buffer to Cloudinary.
 * If Cloudinary credentials are missing, falls back to a base64 data URI.
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      const mime = options.mime || "image/jpeg";
      const base64 = `data:${mime};base64,${buffer.toString("base64")}`;
      return resolve({ secure_url: base64, url: base64 });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "bookify",
        resource_type: options.resource_type || "auto",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

/**
 * Middleware for handling single file uploads.
 * If request is multipart/form-data, uploads the file to Cloudinary and attaches
 * the resulting URL to req.body[fieldName].
 * If request is JSON, proceeds without modification.
 */
export const uploadSingle = (fieldName, folder = "bookify") => {
  const multerHandler = upload.single(fieldName);
  return (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return next();
    }

    multerHandler(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message, data: null });
      }

      if (req.file) {
        try {
          const result = await uploadBufferToCloudinary(req.file.buffer, {
            folder,
            mime: req.file.mimetype,
          });
          const url = result.secure_url || result.url;
          req.body[fieldName] = url;

          if (fieldName === "image" && !req.body.images) {
            req.body.images = [url];
          }
        } catch (uploadErr) {
          console.error("Cloudinary upload failed:", uploadErr);
          return res.status(500).json({
            success: false,
            message: `File upload failed: ${uploadErr.message}`,
            data: null,
          });
        }
      }
      next();
    });
  };
};

/**
 * Middleware for handling multiple distinct file fields (e.g. idDoc, degreeDoc).
 */
export const uploadMultiple = (fieldsConfig, folder = "bookify") => {
  const multerHandler = upload.fields(fieldsConfig);
  return (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return next();
    }

    multerHandler(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message, data: null });
      }

      if (req.files) {
        try {
          for (const fieldName of Object.keys(req.files)) {
            const files = req.files[fieldName];
            if (files && files.length > 0) {
              const file = files[0];
              const result = await uploadBufferToCloudinary(file.buffer, {
                folder,
                mime: file.mimetype,
              });
              const url = result.secure_url || result.url;
              req.body[fieldName] = url;

              // Map doc fields to verification doc URLs if matching
              if (fieldName === "idDoc") {
                req.body.idDocUrl = url;
              }
              if (fieldName === "degreeDoc") {
                req.body.degreeDocUrl = url;
              }
            }
          }
        } catch (uploadErr) {
          console.error("Cloudinary multi-upload failed:", uploadErr);
          return res.status(500).json({
            success: false,
            message: `File upload failed: ${uploadErr.message}`,
            data: null,
          });
        }
      }
      next();
    });
  };
};

/**
 * Middleware for handling an array of files under a single field name (e.g. images[]).
 */
export const uploadArray = (fieldName, maxCount = 5, folder = "bookify") => {
  const multerHandler = upload.array(fieldName, maxCount);
  return (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return next();
    }

    multerHandler(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message, data: null });
      }

      if (req.files && req.files.length > 0) {
        try {
          const urls = [];
          for (const file of req.files) {
            const result = await uploadBufferToCloudinary(file.buffer, {
              folder,
              mime: file.mimetype,
            });
            urls.push(result.secure_url || result.url);
          }
          req.body[fieldName] = urls;
        } catch (uploadErr) {
          console.error("Cloudinary array upload failed:", uploadErr);
          return res.status(500).json({
            success: false,
            message: `File upload failed: ${uploadErr.message}`,
            data: null,
          });
        }
      }
      next();
    });
  };
};

export default {
  upload,
  uploadBufferToCloudinary,
  uploadSingle,
  uploadMultiple,
  uploadArray,
};
