import { forwardRef } from 'react'
import '../styles/components/Input.css'

const Input = forwardRef(({ 
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="input-field"
        required={required}
        {...props}
      />
      
      {error && <p className="input-error">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input