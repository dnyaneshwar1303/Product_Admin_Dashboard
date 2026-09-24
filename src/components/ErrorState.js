export default function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-white rounded-lg shadow p-10 text-center">

      <h2 className="text-xl font-semibold text-red-600">
        Something went wrong
      </h2>

      <p className="text-gray-600 mt-2">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Retry
      </button>

    </div>
  );
}