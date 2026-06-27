const express = require('express');
const router = express.Router();

const {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getMyVehicles,
} = require('../controllers/vehicleController');

const { protect, sellerOnly, optionalAuth } = require('../middleware/authMiddleware');
const { validateVehicle } = require('../middleware/validate');
const upload = require('../config/multer');

// Multer fields: multiple images + optional 3D model
const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'modelFile', maxCount: 1 },
]);


router.get('/', optionalAuth, getVehicles);

router.get('/:id', optionalAuth, getVehicleById);

// ================================
// PROTECTED ROUTES
// ================================

// GET /api/vehicles/my/listings — seller ki apni vehicles
router.get('/my/listings', protect, sellerOnly, getMyVehicles);

// POST /api/vehicles — naya vehicle add karo (validation add ki)
router.post('/', protect, sellerOnly, uploadFields, validateVehicle, addVehicle);

// PUT /api/vehicles/:id — vehicle update karo
router.put('/:id', protect, sellerOnly, uploadFields, updateVehicle);

// DELETE /api/vehicles/:id — vehicle delete karo
router.delete('/:id', protect, sellerOnly, deleteVehicle);

module.exports = router;
