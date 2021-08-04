import React from 'react'; 


export function HeroSection(): React.ReactElement | null {
  return (
    <div className="py-5 bg-white">
      <img 
        className="d-block w-100 mx-auto"
        style={{ maxWidth: 1000 }}
        src="images/home-page-image.jpg"
        alt="Home_Page copy.jpg"         
      />
    </div>
  );
}
