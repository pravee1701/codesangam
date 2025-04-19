import React, { useState, useId } from 'react';
import { EmailIcon, EyeIcon, EyeOffIcon, LockIcon } from './Icons';

const Input = React.forwardRef(function Input({
  label,
  type = "text",
  className = "",
  error,
  leftIcon,
  rightIcon,
  wrapperClassName = "",
  useTypeIcon = true,
  togglePassword = true,
  options = [],
  fullWidth = true,
  placeholder,
  ...props
}, ref) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  // Auto-generate placeholder based on label if not provided
  const computedPlaceholder = placeholder || (label ? `Enter ${label.toLowerCase()}...` : '');

  // Determine input type (will be used if showPassword is true for password fields)
  const inputType = showPassword ? "text" : type;

  // Handle password visibility toggle
  const handleTogglePassword = () => {
    if (togglePassword && type === 'password') {
      setShowPassword(!showPassword);
    }
  };

  // Dynamically determine icons based on type
  const getTypeIcon = () => {
    if (!useTypeIcon) return null;

    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'password':
        return <LockIcon />;
      default:
        return null;
    }
  };

  // Determine right icon (password toggle or custom right icon)
  const computedRightIcon = type === 'password' && togglePassword ? (
    <button
      type="button"
      onClick={handleTogglePassword}
      className="focus:outline-none"
      tabIndex="-1"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  ) : rightIcon;

  // Determine left icon (type-based or custom left icon)
  const computedLeftIcon = leftIcon || getTypeIcon();
  // console.log("===>", computedLeftIcon)
  // return (
  //   <>
  //     {computedLeftIcon}
  //   </>
  // )


  return (
    <div className={wrapperClassName}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      
      <div className="relative">
        {/* Left Icon - Debugged Version */}
        {computedLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {computedLeftIcon}
          </div>
        )}
  
        <input
          id={id}
          ref={ref}
          type={inputType}
          className={`
            w-full py-2 px-4 border border-gray-700 rounded-lg
            bg-gray-800 bg-opacity-70 text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            backdrop-blur-sm
            ${computedLeftIcon ? 'pl-10' : 'pl-4'}
            ${computedRightIcon ? 'pr-10' : 'pr-4'}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          placeholder={computedPlaceholder}
          {...props}
        />
  
        {/* Right Icon */}
        {computedRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {computedRightIcon}
          </div>
        )}
      </div>
  
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
  

});

export default Input;
