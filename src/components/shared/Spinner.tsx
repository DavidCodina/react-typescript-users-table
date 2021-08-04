import React from 'react'; 


interface SpinnerProps {
  variant?:          string;
  classes?:          string;
  size?:             string | number;
  style?:            React.CSSProperties;
  containerStyle?:   React.CSSProperties;
  containerClasses?: string; 
  useContainer?:     boolean;
}


// Helper for object literals.
function isEmpty(obj:object){
  for (var prop in obj){ if (obj.hasOwnProperty(prop)){ return false; } }
  return true;
}


// useContainer = false by default. However, configuring containerClasses or containerStyle,
// will still cause the spinner to render with a <div> wrapper.
// In the absence of any other styling, the spinner will default to the currentColor
// of the parent element.
export function Spinner({ 
  variant          = '',
  classes          = '',
  size             = 50, 
  style            = {},
  containerStyle   = {},
  containerClasses = '',
  useContainer     = false
}: SpinnerProps){

  const setSpinnerClasses = () => {
    if (variant  && classes){  return `spinner-border text-${variant} ${classes}`; }
    if (variant  && !classes){ return `spinner-border text-${variant}`; }
    if (!variant && classes){  return `spinner-border ${classes}`; }
    // Same as: if (!variant && !classes){ return `spinner-border`; }
    return 'spinner-border';
  };


  const renderSpinner = () => {
    if (useContainer || containerClasses || !isEmpty(containerStyle)){
      return ( 
        <div 
          className={containerClasses}
          style={containerStyle}>
          <div 
            className={ setSpinnerClasses() }
            style={{ width: size, height: size, ...style }} 
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div> 
      ); 
    } 


    return (
      <div 
        className={ setSpinnerClasses() }
        style={{ width: size, height: size, ...style }} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  };

  return renderSpinner();
}