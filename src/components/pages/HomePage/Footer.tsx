import React from 'react'; 


export function Footer(): React.ReactElement | null {
  
  return (
    <footer className="d-flex p-5 text-white" style={{ backgroundColor: '#484A63' }}>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-center justify-content-md-start flex-wrap">
          <div className="font-montserrat me-3 mb-3 text-nowrap">Curriculum</div>
          <div className="font-montserrat me-3 mb-3 text-nowrap">PD & Learning</div>
          <div className="font-montserrat me-3 mb-3 text-nowrap">Resources</div>
          <div className="font-montserrat mb-3 text-nowrap">About Us</div>
        </div>

        <div className="d-flex justify-content-center justify-content-md-start fw-lighter fst-italic">
          Copyright &#169; inquirED 2020
        </div>
      </div>

      {/* img wrapper element needed for Safari */}
      <figure className="d-none d-md-block" style={{ width: 100 }}>
        <img 
          className="d-block"
          style={{ position: 'relative', top: -15, width: '100%' }}
          src="images/logo.png"
          alt="inquirED Logo" 
        />
      </figure>
    </footer>
  );
}
