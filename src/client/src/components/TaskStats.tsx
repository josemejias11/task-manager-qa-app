interface TaskStatsProps {
  activeCount: number;
  completedCount: number;
  totalCount: number;
}

export function TaskStats({ activeCount, completedCount, totalCount }: TaskStatsProps) {
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="app-title mb-0">
          <span className="icon-task">✓</span> Task Manager
        </h1>
        <div className="task-stats">
          <span className="badge bg-primary">{activeCount} active</span>
          <span className="badge bg-success">{completedCount} completed</span>
        </div>
      </div>

      <div className="progress mb-3" style={{ height: '8px' }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </>
  );
}
