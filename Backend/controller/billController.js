const MedicalBill = require('../models/MedicalBill');

// Create a new bill
const createBill = async (billData) => {
  const bill = new MedicalBill(billData);
  try {
    const savedBill = await bill.save();
    return savedBill;
  } catch (err) {
    throw new Error('Error creating the bill: ' + err.message);
  }
};

// Get all bills
const getAllBills = (req, res) => {
  MedicalBill.find()
    .sort({ createdAt: -1 })
    .then((MedicalBills) => {
      res.json(MedicalBills);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json('Error: ' + err);
    });
};

// Get bill by ID
const getBillById = async (billId) => {
  try {
    const bill = await MedicalBill.findById(billId);
    if (!bill) {
      throw new Error('Bill not found');
    }
    return bill;
  } catch (err) {
    throw new Error('Error fetching the bill: ' + err.message);
  }
};

// Get bills by user ID
const getBillsByUserId = async (userId) => {
  try {
    const bills = await MedicalBill.find({
      patientID: userId,
    });
    return bills;
  } catch (err) {
    throw new Error('Error fetching bills: ' + err.message);
  }
};

const getPaymentHistoryByUserId = async (userId) => {
  if (!userId) {
    throw new Error('Invalid user ID');
  }

  try {
    const bills = await MedicalBill.find({
      patientID: userId,
      paidStatus: { $in: ['paid', 'partially paid'] },
    });

    if (!bills.length) {
      throw new Error('No payment history found for this user');
    }

    return bills;
  } catch (err) {
    throw new Error('Error fetching payment history: ' + err.message);
  }
};

// Update the payment status of a bill
const updateBillPayment = async (billId, paidStatus) => {
  try {
    const updatedBill = await MedicalBill.findByIdAndUpdate(
      billId,
      { paidStatus: paidStatus },
      { new: true }
    );
    if (!updatedBill) throw new Error('Bill not found');
    return updatedBill;
  } catch (err) {
    throw new Error('Error updating the payment status: ' + err.message);
  }
};

// Delete a bill
const deleteBill = (req, res) => {
  const { id } = req.params;

  MedicalBill.findByIdAndDelete(id)
    .then(() => res.json('Bill deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
};

// Update a bill
const updateBill = (req, res) => {
  const { id } = req.params;

  MedicalBill.findById(id)
    .then((bill) => {
      if (!bill) {
        return res.status(404).json('Bill not found.');
      }

      // Update fields
      bill.patientName = req.body.patientName;
      bill.totalAmount = req.body.totalAmount;
      bill.paidAmount = req.body.paidAmount;
      bill.balanceAmount = req.body.balanceAmount;
      bill.paidStatus = req.body.paidStatus;

      // Save the updated bill
      bill
        .save()
        .then(() => res.json('Bill updated.'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
};

module.exports = {
  createBill,
  getAllBills,
  getBillById,
  updateBillPayment,
  getBillsByUserId,
  getPaymentHistoryByUserId,
  deleteBill,
  updateBill,
};
