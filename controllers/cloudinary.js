const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wack-photos',
    format: async () => 'jpeg',
    width: 500,
    height: 500,
    crop: 'crop',
    gravity: 'face',
    quality: 90,
    public_id: (req) => {
      const customName = `user-${req.user._id}-${Date.now()}`;
      return customName;
    },
  },
});

module.exports = {
  cloudinary,
  storage,
};
