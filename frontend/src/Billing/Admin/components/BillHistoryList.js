import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function BillHistoryList({
  searchTerm,
  handleSearch,
  editBill,
  handleDeleteBill,
  billsPerPage,
  paginate,
  currentPage,
  currentBills,
  filteredBills,
}) {

    
  return (
    <div className="bg-gray-50 p-8 rounded-md">
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by Patient Name or Appointment ID"
          className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
        <Link
          to="/AddNewBill"
          className="flex justify-center items-center bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-900 focus:bg-blue-800 focus:outline-none transition-all duration-300 ml-12"
        >
          Add New Bill
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-4 px-6 text-gray-600 font-medium">
                Patient Name
              </th>
              <th className="py-4 px-6 text-gray-600 font-medium">
                Appointment ID
              </th>
              <th className="py-4 px-6 text-gray-600 font-medium">
                Total Amount
              </th>
              <th className="py-4 px-6 text-gray-600 font-medium">
                Paid Amount
              </th>
              <th className="py-4 px-6 text-gray-600 font-medium">Balance</th>
              <th className="py-4 px-6 text-gray-600 font-medium">
                Payment Status
              </th>
              <th className="py-4 px-6 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBills.map((bill) => (
              <tr
                key={bill._id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-6">{bill.patientName}</td>
                <td className="py-4 px-6">{bill.appointmentID}</td>
                <td className="py-4 px-6">
                  ${Number(bill.totalAmount).toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  ${Number(bill.paidAmount).toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  ${Number(bill.balanceAmount).toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      bill.paidStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {bill.paidStatus}
                  </span>
                </td>
                <td className="py-4 px-6 flex space-x-3">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => editBill(bill)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteBill(bill._id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        {Array.from(
          {
            length: Math.ceil(filteredBills.length / billsPerPage),
          },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 border rounded-lg ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500'
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}
