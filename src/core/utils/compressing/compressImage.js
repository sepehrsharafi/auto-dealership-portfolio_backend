import sharp from "sharp";

const compressImage = async (file) => {
  try {
    const originalSizeInBytes = file.buffer.length;
    console.log(
      `Original file size (${file.originalname}): ${originalSizeInBytes} bytes`
    );

    const compressedImageBuffer = await sharp(file.buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    const compressedSizeInBytes = compressedImageBuffer.length;
    console.log(
      `Compressed file size (${file.originalname}): ${compressedSizeInBytes} bytes`
    );

    const reductionPercentage =
      ((originalSizeInBytes - compressedSizeInBytes) / originalSizeInBytes) *
      100;
    console.log(
      `Size reduction for ${file.originalname}: ${reductionPercentage.toFixed(
        2
      )}%`
    );

    return {
      ...file,
      buffer: compressedImageBuffer,
      originalname: `${file.originalname.split(".")[0]}.webp`,
    };
  } catch (error) {
    console.error(`Failed to compress file: ${file.originalname}`, error);
    throw error;
  }
};

export default compressImage;
