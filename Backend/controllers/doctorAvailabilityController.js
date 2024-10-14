// src/controllers/doctorAvailabilityController.js

const DoctorAvailability = require('../models/DoctorAvailability');

// Create a new doctor availability
const createDoctorAvailability = async (availabilityData) => {
  const availability = new DoctorAvailability(availabilityData);
  try {
    const savedAvailability = await availability.save();
    return savedAvailability;
  } catch (err) {
    throw new Error('Error creating doctor availability: ' + err.message);
  }
};

// Get all doctor availabilities
const getAllDoctorAvailabilities = async () => {
  try {
    const availabilities = await DoctorAvailability.find().sort({ date: -1, startTime: 1 });
    return availabilities;
  } catch (err) {
    throw new Error('Error fetching doctor availabilities: ' + err.message);
  }
};

// Get doctor availability by ID
const getDoctorAvailabilityById = async (availabilityId) => {
  try {
    const availability = await DoctorAvailability.findById(availabilityId);
    if (!availability) {
      throw new Error('Doctor availability not found');
    }
    return availability;
  } catch (err) {
    throw new Error('Error fetching doctor availability: ' + err.message);
  }
};

// Update doctor availability by ID
const updateDoctorAvailability = async (availabilityId, updateData) => {
  try {
    const updatedAvailability = await DoctorAvailability.findByIdAndUpdate(
      availabilityId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedAvailability) {
      throw new Error('Doctor availability not found');
    }
    return updatedAvailability;
  } catch (err) {
    throw new Error('Error updating doctor availability: ' + err.message);
  }
};

// Delete doctor availability by ID
const deleteDoctorAvailability = async (availabilityId) => {
  try {
    const deletedAvailability = await DoctorAvailability.findByIdAndDelete(availabilityId);
    if (!deletedAvailability) {
      throw new Error('Doctor availability not found');
    }
    return deletedAvailability;
  } catch (err) {
    throw new Error('Error deleting doctor availability: ' + err.message);
  }
};

module.exports = {
  createDoctorAvailability,
  getAllDoctorAvailabilities,
  getDoctorAvailabilityById,
  updateDoctorAvailability,
  deleteDoctorAvailability,
};
