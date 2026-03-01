/**
 * Modern Input Component
 * With label, helper text, error state, and icons
 */
export function Input({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    className = '',
    ...props
}) {
    const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && iconPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
                        disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
                        ${icon && iconPosition === 'left' ? 'pl-10' : ''}
                        ${icon && iconPosition === 'right' ? 'pr-10' : ''}
                        ${error 
                            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
                            : 'border-gray-300 hover:border-gray-400'
                        }
                    `}
                    {...props}
                />
                {icon && iconPosition === 'right' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
            </div>
            {(helperText || error) && (
                <p className={`mt-1.5 text-sm ${error ? 'text-danger-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
}

/**
 * Modern Select Component
 */
export function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    helperText,
    required = false,
    disabled = false,
    placeholder = 'Select an option',
    className = '',
    ...props
}) {
    const selectId = name || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                        w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 appearance-none
                        focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
                        disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
                        ${error 
                            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
                            : 'border-gray-300 hover:border-gray-400'
                        }
                    `}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {(helperText || error) && (
                <p className={`mt-1.5 text-sm ${error ? 'text-danger-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
}

/**
 * Modern Textarea Component
 */
export function Textarea({
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    rows = 4,
    className = '',
    ...props
}) {
    const textareaId = name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={textareaId} className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                id={textareaId}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={`
                    w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200
                    placeholder:text-gray-400
                    focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
                    disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
                    resize-y
                    ${error 
                        ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                `}
                {...props}
            />
            {(helperText || error) && (
                <p className={`mt-1.5 text-sm ${error ? 'text-danger-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
}
