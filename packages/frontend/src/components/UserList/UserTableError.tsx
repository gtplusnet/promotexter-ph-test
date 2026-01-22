import './UserTableError.css'

interface UserTableErrorProps {
  error: Error
  onRetry: () => void
}

export function UserTableError({ error, onRetry }: UserTableErrorProps) {
  return (
    <tr>
      <td colSpan={7}>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h3 className="error-title">Failed to load users</h3>
            <p className="error-message">{error.message}</p>
            <button className="retry-button" onClick={onRetry}>
              Retry
            </button>
          </div>
        </div>
      </td>
    </tr>
  )
}
