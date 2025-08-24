export default function Table({ columns, rows, sortBy, order, onSort }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c.key} onClick={() => onSort?.(c.key)}>
              {c.title} {sortBy===c.key ? (order==='asc' ? '↑' : '↓') : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r,i) => (
          <tr key={r.id ?? i}>
            {columns.map(c => (
              <td key={c.key}>{c.render ? c.render(r[c.key], r) : r[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
