interface ActionButtonsProps {
  completedCount: number;
  onClearCompleted: () => Promise<void>;
  onRemoveAll: () => Promise<void>;
}

export function ActionButtons({
  completedCount,
  onClearCompleted,
  onRemoveAll,
}: ActionButtonsProps) {
  return (
    <div className="action-buttons mb-3">
      <button
        type="button"
        className="btn btn-outline-success"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        <span className="icon-check">✓✓</span> Clear Completed
      </button>
      <button type="button" className="btn btn-outline-danger" onClick={onRemoveAll}>
        <span className="icon-trash">🗑</span> Remove All
      </button>
    </div>
  );
}
