export default function IncomeCard({ title, amount }) {
    return (
      <div className="bg-white p-4 rounded-2xl">
        <h3 className="text-gray-800 font-semibold text-lg">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 py-1">{amount} SAR</p>
        <p className="text-gray-800 text-sm">Total Payment Received</p>
      </div>
    );
  }
  
