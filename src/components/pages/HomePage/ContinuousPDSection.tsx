import React from 'react'; 


export function ContinuousPDSection(): React.ReactElement | null {
  return (
    <section 
      id="continuous-pd-section"
      className="py-5 px-3 p-sm-5" 
      style={{ color: 'rgb(71,74,99)' }}
    >
      <div className="section-inner mx-auto" style={{ maxWidth: 1000 }}>
        <h2 className="font-montserrat">Continuous PD & Learning</h2>


        <div className="row">
          <div className="col d-none d-md-flex align-items-center">

            <img 
              style={{ 
                display: 'block',
                position: 'relative',
                top: -25,
                width: '75%',
                maxWidth: 275,
                objectFit: 'fill', 
                transform: 'rotate(-15deg)'
              }}
              src="images/continuous-pd.png"
              alt="inquiry-based ideas" 
            />
          </div>


          {/* ====================== */}


          <div className="col d-flex flex-column align-items-center align-items-md-end pe-md-5">
            <img 
              className="d-block d-md-none mx-auto my-4"
              style={{ 
                width: '100%',
                maxWidth: 150,
                objectFit: 'fill', 
              }}
              src="images/continuous-pd.png"
              alt="inquiry-based ideas" 
            />

            <p className="font-lato mb-0" style={{ fontSize: 20, lineHeight: 1.25 }}>
              Inquiry requires a shift in teaching practice—which can feel overwhelming to teachers.
            </p>

            <hr style={{ width: 250, height: 1, margin: '25px 0', opacity: 1 }} />
            
            <p className="font-lato" style={{ fontSize: 20, lineHeight: 1.25 }}>
              inquirED’s professional learning resources offer support to teachers, 
              building their practice and confidence as they implement inquiry.
            </p>
          
            <button className="btn btn-outline-gray mt-auto py-2 px-5 font-montserrat border-2 rounded-3">Learn More</button>
          </div>
        </div>{/* End of <div className="row"> */}
      </div>{/* End of <div className="section-inner" */}
    </section>
  );
}
