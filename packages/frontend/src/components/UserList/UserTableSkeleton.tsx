import './UserTableSkeleton.css'

export function UserTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index} className="skeleton-row">
          <td>
            <div className="skeleton skeleton-text skeleton-short"></div>
          </td>
          <td>
            <div className="skeleton skeleton-text"></div>
          </td>
          <td>
            <div className="skeleton skeleton-text"></div>
          </td>
          <td>
            <div className="skeleton skeleton-text skeleton-short"></div>
          </td>
          <td>
            <div className="skeleton skeleton-badge"></div>
          </td>
          <td>
            <div className="skeleton skeleton-text skeleton-short"></div>
          </td>
          <td>
            <div className="skeleton-actions">
              <div className="skeleton skeleton-button"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}
