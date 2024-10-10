import { FaSearch, FaEye } from 'react-icons/fa';

export default function BillCard({ bill, navigate }) {
  return (
    <div className="space-y-4">
      {bill.map((bill) => (
        <div
          key={bill._id}
          className="flex justify-between items-center bg-white shadow rounded-lg p-4"
        >
          <div>
            <p className="font-semibold">{bill.hospitalName}</p>
            <p className="text-sm text-gray-500">{bill.date}</p>
            <p className="text-lg font-semibold">
              Balance: ${bill.totalAmount}
            </p>
            <p className="text-sm">Status: {bill.paidStatus}</p>
          </div>
          {/* Button to navigate to bill details */}
          <button
            onClick={() => navigate(`/billDetails/${bill._id}`)}
            className="p-2 bg-purple-500 text-white rounded-full"
          >
            <FaEye />
          </button>
        </div>
      ))}
    </div>
  );
}
