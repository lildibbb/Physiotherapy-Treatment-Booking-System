import { Buffer } from "buffer";
import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import { pipeline } from "stream/promises";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
// Define allowed file types and max size
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = join(process.cwd(), "src", "uploads", "avatars");

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

interface FileUploadResult {
  path: string;
  error?: string;
}

export async function handleFileUpload(file: File): Promise<FileUploadResult> {
  try {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        path: "",
        error:
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        path: "",
        error: "File size exceeds 5MB limit.",
      };
    }

    // Generate unique filename
    const fileExtension = file.type.split("/")[1];
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(UPLOAD_DIR, fileName);
    console.log("File path {create}:", filePath);
    const relativePath = join("uploads", "avatars", fileName);
    console.log("Relative path {create}:", relativePath);
    // Create read and write streams
    const fileBuffer = await file.arrayBuffer();
    const writeStream = createWriteStream(filePath);

    // Write the file
    await new Promise((resolve, reject) => {
      writeStream.write(Buffer.from(fileBuffer), (error) => {
        if (error) reject(error);
        else resolve(true);
      });
    });

    return { path: relativePath };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      path: "",
      error: "Failed to upload file.",
    };
  }
}

// Helper function to delete old avatar if it exists
export async function deleteOldAvatar(avatarPath: string) {
  if (!avatarPath) return;

  try {
    // Normalize the path with proper separators
    const normalizedPath = avatarPath.split("\\").join("/");
    const fileName = normalizedPath.split("/").pop();

    // Construct the full path
    const fullPath = join(
      process.cwd(),
      "src",
      "uploads",
      "avatars",
      fileName || ""
    );

    console.log("Normalized path:", normalizedPath);
    console.log("File name to delete:", fileName);
    console.log("Full path to delete:", fullPath);
    console.log("File exists check:", existsSync(fullPath));

    if (existsSync(fullPath)) {
      try {
        await unlink(fullPath);
        console.log("File successfully deleted");
        return true;
      } catch (error) {
        console.error("Error in unlink operation:", error);
        throw error;
      }
    } else {
      console.log("File does not exist at path:", fullPath);
      return false;
    }
  } catch (error) {
    console.error("Error in deleteOldAvatar:", error);
    throw error;
  }
}
