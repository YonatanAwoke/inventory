
export const DeleteConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    deleting: boolean;
  }) => {
    const deleting = false;
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-opacity-60 z-50 flex items-center justify-center">
        <div className="bg-[#1A1F2C] rounded-2xl p-6 w-full max-w-sm text-white shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Delete this item</h2>
          <p className="text-gray-400 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };
  