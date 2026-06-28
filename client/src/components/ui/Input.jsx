import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  wrapperClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label className="text-[11px] font-bold text-dark-200 uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-300 group-focus-within:text-violet-400 transition-colors pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white/5 border border-white/[0.08] text-white text-sm rounded-xl
            placeholder-dark-300 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10
            transition-all duration-200
            ${Icon ? 'pl-10' : 'px-4'}
            ${error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10' : ''}
            py-3
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] text-rose-400 font-medium ml-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
