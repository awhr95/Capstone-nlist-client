import "./Input.scss";

function Input({ label, name, type, onChange, value }) {
  return (
    <div className="field">
      <label htmlFor={name} className="field__label">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        id={name}
        name={name}
        value={value}
        className="field__input"
      />
    </div>
  );
}

export default Input;
