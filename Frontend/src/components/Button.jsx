import '../styles/components/Button.css'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) {
  return (
    <button
      type={type}
      className={`
        button 
        button-${variant} 
        button-${size} 
        ${fullWidth ? 'full-width' : ''} 
        ${disabled ? 'disabled' : ''}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button