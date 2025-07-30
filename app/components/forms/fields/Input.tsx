export default function InputField({ name, label, required, error }: any) {
    return (
        <div>
            <label htmlFor={name} className="font-semibold">{label}</label>
            <input
                id={name}
                name={name}
                type="text"
                required={required}
                className="input"
            />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}