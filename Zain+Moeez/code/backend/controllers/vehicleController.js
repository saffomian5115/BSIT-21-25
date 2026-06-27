const Vehicle = require('../models/Vehicle');
const fs = require('fs');
const path = require('path');

// ================================
// ADD VEHICLE
// POST /api/vehicles
// ================================
const addVehicle = async (req, res) => {
  try {
    const { title, description, price, city, category } = req.body;

    const images = req.files?.images
      ? req.files.images.map((file) => file.path.replace(/\\/g, '/'))
      : [];

    const modelFile = req.files?.modelFile
      ? req.files.modelFile[0].path.replace(/\\/g, '/')
      : null;

    const vehicle = await Vehicle.create({
      title,
      description,
      price,
      city,
      category,
      images,
      modelFile,
      seller: req.user._id,
    });

    res.status(201).json({
      message: 'Vehicle listed successfully',
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// GET ALL VEHICLES
// GET /api/vehicles
// Public — with filters + pagination + search
// ================================
const getVehicles = async (req, res) => {
  try {
    const {
      city,
      category,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      status = 'approved',
      sort = 'newest',
    } = req.query;

    // ---- Base status filter ----
    let filter = {};

    if (req.user?.role === 'admin') {
      if (status && status !== 'all') filter.status = status;
      // if status=all, no status filter — admin sees everything
    } else if (req.user?.role === 'seller') {
      // Seller: apni sab ya approved listings
      filter.$or = [
        { seller: req.user._id },
        { status: 'approved' },
      ];
    } else {
      // Buyer / public: sirf approved
      filter.status = 'approved';
    }

    // ---- Simple filters ----
    if (city)     filter.city = { $regex: city, $options: 'i' };
    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ---- Search (title, description, city) ----
    // NOTE: $or already used for seller logic above, so we use $and to combine
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      const searchCondition = {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { city: searchRegex },
        ],
      };

      // If filter already has $or (seller case), wrap both in $and
      if (filter.$or) {
        const existingOr = filter.$or;
        delete filter.$or;
        filter.$and = [
          { $or: existingOr },
          searchCondition,
        ];
      } else {
        // Merge search $or directly
        filter.$or = searchCondition.$or;
      }
    }

    // ---- Sort ----
    let sortObj = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc')  sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'views')      sortObj = { views: -1 };
    if (sort === 'oldest')     sortObj = { createdAt: 1 };

    // ---- Pagination ----
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total    = await Vehicle.countDocuments(filter);
    const vehicles = await Vehicle.find(filter)
      .populate('seller', 'name email city phone')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      vehicles,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// GET SINGLE VEHICLE
// GET /api/vehicles/:id
// ================================
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      'seller',
      'name email city phone createdAt'
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle.views += 1;
    await vehicle.save();

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// UPDATE VEHICLE
// PUT /api/vehicles/:id
// ================================
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (
      req.user.role === 'seller' &&
      vehicle.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this vehicle' });
    }

    const { title, description, price, city, category, status } = req.body;

    if (status && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can change vehicle status' });
    }

    const newImages = req.files?.images
      ? req.files.images.map((file) => file.path.replace(/\\/g, '/'))
      : [];

    const newModelFile = req.files?.modelFile
      ? req.files.modelFile[0].path.replace(/\\/g, '/')
      : null;

    if (title)       vehicle.title = title;
    if (description) vehicle.description = description;
    if (price)       vehicle.price = price;
    if (city)        vehicle.city = city;
    if (category)    vehicle.category = category;
    if (status && req.user.role === 'admin') vehicle.status = status;
    if (newImages.length > 0) vehicle.images = [...vehicle.images, ...newImages];
    if (newModelFile) vehicle.modelFile = newModelFile;

    const updated = await vehicle.save();

    res.status(200).json({
      message: 'Vehicle updated successfully',
      vehicle: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// DELETE VEHICLE
// DELETE /api/vehicles/:id
// ================================
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (
      req.user.role === 'seller' &&
      vehicle.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this vehicle' });
    }

    const deleteFile = (filePath) => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    };

    vehicle.images.forEach(deleteFile);
    deleteFile(vehicle.modelFile);

    await vehicle.deleteOne();

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// GET MY VEHICLES (Seller)
// GET /api/vehicles/my/listings
// ================================
const getMyVehicles = async (req, res) => {
  try {
    const { search, status, category, city, sort = 'newest' } = req.query;

    const filter = { seller: req.user._id };

    if (status)   filter.status = status;
    if (category) filter.category = category;
    if (city)     filter.city = { $regex: city, $options: 'i' };

    if (search && search.trim()) {
      filter.$or = [
        { title:       { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { city:        { $regex: search.trim(), $options: 'i' } },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc')  sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'views')      sortObj = { views: -1 };

    const vehicles = await Vehicle.find(filter).sort(sortObj);

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// SEARCH SUGGESTIONS
// GET /api/vehicles/search/suggestions?q=...
// Public
// ================================
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(200).json({ suggestions: [] });
    }

    const regex = { $regex: q.trim(), $options: 'i' };

    const vehicles = await Vehicle.find(
      {
        status: 'approved',
        $or: [{ title: regex }, { city: regex }],
      },
      'title city category'
    )
      .limit(8)
      .lean();

    // Unique city suggestions
    const cities = [...new Set(
      vehicles
        .map(v => v.city)
        .filter(c => c && c.toLowerCase().includes(q.toLowerCase()))
    )].slice(0, 3);

    // Title suggestions
    const titles = vehicles
      .filter(v => v.title.toLowerCase().includes(q.toLowerCase()))
      .map(v => ({ text: v.title, type: 'vehicle', category: v.category }))
      .slice(0, 5);

    res.status(200).json({
      suggestions: [
        ...cities.map(c => ({ text: c, type: 'city' })),
        ...titles,
      ],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getMyVehicles,
  getSearchSuggestions,
};