export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Example function for fetching video metadata (like duration)
export const getCloudinaryVideoData = async (publicId: string) => {
  // This would typically be a server-side call or using the Admin API
  // For client-side, we usually get this from the widget response.
  return { publicId };
};
