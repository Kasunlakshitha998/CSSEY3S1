// Test/doctorAvailabilityController.test.js

const {
    createDoctorAvailability,
  } = require('../controllers/doctorAvailabilityController');
  const DoctorAvailability = require('../models/DoctorAvailability'); // Adjust the path as needed
  
  jest.mock('../models/DoctorAvailability'); // Mock the DoctorAvailability model
  
  describe('Doctor Availability Controller', () => {
    const availabilityData = {
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '17:00',
    };
  
    it('should create a new doctor availability and return it', async () => {
      const savedAvailability = { id: '123', ...availabilityData };
      DoctorAvailability.prototype.save.mockResolvedValue(savedAvailability); // Mock save method
  
      const result = await createDoctorAvailability(availabilityData);
      expect(result).toEqual(savedAvailability); // Check if the result matches the saved availability
      expect(DoctorAvailability.prototype.save).toHaveBeenCalledTimes(1); // Ensure save was called once
    });
  });
  