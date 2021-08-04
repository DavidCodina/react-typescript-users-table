import React                from 'react';
import { FlexibleFunction } from '../../interfaces';


interface AlertProps {
  className?:           string;
  style?:               React.CSSProperties;
  color?:               string
  headerContent? :      React.ReactNode | null;
  bodyContent?:         React.ReactNode | null;
  showCloseButton?:     boolean;
  closeButtonFunction?: FlexibleFunction; 
}


/* ========================================================================

======================================================================== */


export const Alert = ({ 
  style           = {},
  className       = '',
  color           = 'gray', 
  headerContent   = null, 
  bodyContent     = null,
  showCloseButton = true,
  closeButtonFunction }: AlertProps): React.ReactElement | null => {
  
  return (
    <div 
      // The biggest issue with using Bootstrap utility classes for the default component style is that
      // they always have !important on them, which means it's very difficult to override them.
      // For that reason it's often better to create the default styles using the style attribute.
      // That way you can override the default style with a utility class, or with style overwrites.
      className={`alert alert-${color} alert-dismissible fade show border border-${color}${className ? ` ${className}` : ''}`}
      
      style={{ 
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        width: '100%', 
        maxWidth: 600, 
        transform: 'translate(-50%, -50%)',
        borderRadius: 10,
        ...style
      }} 
    >
      { headerContent }

      { bodyContent }

      { showCloseButton && (
        <button 
          className="btn-close"
          // https://stackoverflow.com/questions/39194122/is-it-safe-to-pass-undefined-in-reacts-onclick
          // It's perfectly valid to pass in undefined as the onClick handler....
          onClick={closeButtonFunction} 
          aria-label="Close"
          type="button"  
        ></button>
      )}
    </div>
  );
};


