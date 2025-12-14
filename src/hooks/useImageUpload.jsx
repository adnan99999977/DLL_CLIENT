import { useState } from "react";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dd1sxbdgc/image/upload";
const UPLOAD_PRESET = "DLLimages";

const useImageUpload = () => {
  const [imageURL, setImageURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("Choose a profile image");

  /**
   
   * @param {File} file -
   */
  const uploadFile = async (file) => {
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setError(null);
    setImageURL(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "DLLimages");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dd1sxbdgc/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok && data.secure_url) {
        setImageURL(data.secure_url);
      } else {
        const uploadError = data.error?.message || "Cloudinary upload failed";
        setError(uploadError);
        console.error("Cloudinary Error:", data);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Network or internal upload error.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setImageURL(null);
    setError(null);
    setFileName("Choose a profile image");
  };

  return {
    imageURL,
    isUploading,
    error,
    fileName,
    uploadFile,
    resetUpload,
  };
};

export default useImageUpload;
