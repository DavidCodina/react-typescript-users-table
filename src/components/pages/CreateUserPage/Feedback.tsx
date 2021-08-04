import React from 'react';


interface FeedbackProps {
  error:      string;
  className?: string;
  style?:     React.CSSProperties;
}


export const Feedback = ({ 
  error     = '', 
  className = '', 
  style     = {} }: FeedbackProps): React.ReactElement | null  => {
  const defaultClassName = 'mt-1 text-end';

  return (
    <div 
      className={`invalid-feedback${className ? ` ${className}` : ` ${defaultClassName}`}`}
      style={style}
    >{error}</div>
  );
};