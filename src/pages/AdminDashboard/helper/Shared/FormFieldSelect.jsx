import PropTypes from 'prop-types';

const FormFieldsSelect = ({ label, value, onChange, options, isFieldChanged, error, width, renderOption, disabled = false }) => (
    <div className="flex flex-col" style={{ width: width }}>
        <label className="text-gray-700 font-medium">{label}</label>
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`border p-2 rounded-lg placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                        transition duration-300 
                    focus:ring-accent focus:border-transparent
                    ${error ? 'border-red-500' :
                    isFieldChanged ? 'border-green-500' : 'border-gray-300'
                }`}
        >
            {options.map((option) => (
                <option
                    className={``}
                    key={option.id} value={option.id} disabled={option.id === value}>
                    {renderOption ? renderOption(option) : option.abr}
                </option>
            ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

FormFieldsSelect.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        abr: PropTypes.string,
        name: PropTypes.string,
        city: PropTypes.string
    })).isRequired,
    isFieldChanged: PropTypes.bool.isRequired,
    error: PropTypes.string,
    width: PropTypes.string,
    renderOption: PropTypes.func,
    disabled: PropTypes.bool
};

export default FormFieldsSelect;