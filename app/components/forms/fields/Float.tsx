export default function FloatField({ name, label, error, value, onChange, placeholder }: any) {
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <input
                type="text"
                name={name}
                id={name}
                inputMode="decimal"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="input"
            />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}