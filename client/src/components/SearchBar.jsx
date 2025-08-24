export default function SearchBar({ fields, values, onChange, onSubmit }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit?.(); }} className="row">
      {fields.map(f => (
        <input key={f.key} placeholder={f.placeholder} value={values[f.key]||''} onChange={e => onChange(f.key, e.target.value)} />
      ))}
      <button type="submit">Search</button>
    </form>
  );
}
