import PropTypes from 'prop-types';

const FormField = ({ label, value, onChange, placeholder, type = 'text', disabled = false, error, isFieldChanged, width }) => (
    <div className="flex flex-col"
        style={{ width: width }}
    >
        <label className="text-gray-700 font-medium">{label}</label>
        <div className="flex items-center">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`border p-2 rounded-lg placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                        transition duration-300 
                    focus:ring-accent focus:border-transparent
                         [&::-webkit-inner-spin-button]:appearance-none 
                       ${error ? 'border-red-500' :
                        isFieldChanged ? 'border-green-500' : 'border-gray-300'
                    }`}

            />
            {label === "Hex Code" && (
                <div
                    className="w-14 h-full ml-4 rounded-lg border border-gray-200"
                    style={{ backgroundColor: value }}
                />
            )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    isFieldChanged: PropTypes.bool,
    width: PropTypes.string,
};

export default FormField;