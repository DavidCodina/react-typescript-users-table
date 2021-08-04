import React from 'react'; 
// This component works in conjunction with bootstrap-icons.css,
// and bootstrap-icons.woff2 / woff


interface IconProps {
  name?:    string;
  size?:    string | number;
  color?:   string;
  className?: string;
  style?:   React.CSSProperties;
}


export const Icon = ({ 
  name      = 'question-circle', 
  size      = 'inherit', 
  color     = 'currentColor', 
  className = '',
  style     = {} 
}: IconProps) => {

  return (
    <i 
      className={ className ? `bi bi-${name} ${className}` : `bi bi-${name}`} 
      style={{ 
        fontSize: size, 
        color: color, 
        ...style 
      }}
    ></i>   
  );
}