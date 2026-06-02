export const ALLOWED_FILE_TYPES = {
  mimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ],
  extensions: [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"],
  label: "PDF, DOC, PNG, JPG",
};

export const IMAGE_TYPES = {
  mimeTypes: ["image/png", "image/jpeg", "image/jpg"],
  extensions: ".png,.jpg,.jpeg",
  label: "PNG or JPG",
};

export const VIDEO_TYPES = {
  mimeTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
  extensions: ".mp4,.webm,.ogg,.mov",
  label: "MP4, WebM, MOV",
};
