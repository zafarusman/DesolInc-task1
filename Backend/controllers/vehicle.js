const multer = require('multer');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('pictures', 10);

exports.createVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading files', error: err.message });
    }

    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { model, price, phone, city } = req.body;
    const userId = req.user._id;
    console.log('User ID:', userId);

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ message: 'User not found' });

      const pictures = req.files.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));

      const newVehicle = new Vehicle({
        user: userId,
        model,
        price,
        phone,
        city,
        pictures,
      });

      await newVehicle.save();
      res.json(newVehicle);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
};

