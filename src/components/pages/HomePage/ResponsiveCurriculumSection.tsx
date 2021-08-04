import React from 'react'; 


export function ResponsiveCurriculumSection(): React.ReactElement | null {
  return (
    <section 
      id="responsive-curriculum-section"
      className="py-5 px-3 p-sm-5 text-white" 
      style={{ backgroundColor: 'rgb(132, 135, 156)' }}
    >
      <div className="section-inner mx-auto" style={{ maxWidth: 1000 }}>
        <h2 className="font-montserrat">Responsive Curriculum</h2>


        <div className="row">
          <div className="col col-lg-8 d-flex flex-column align-items-center align-items-md-start pe-md-5">
            <img 
              className="d-block d-md-none mx-auto my-4"
              style={{ 
                width: '100%',
                maxWidth: 150,
                objectFit: 'fill', 
              }}
              src="images/responsive-curriculum.png"
              alt="Inquiry-based supplies"
            />


            <p className="font-lato mb-0" style={{ fontSize: 20, lineHeight: 1.25 }}>
              The answers to tomorrow's problems can't be found in the back of a social studies textbook. 
              The skills needed in the modern workplace aren't practiced on a worksheet.  
            </p>


            <hr style={{ width: 250, height: 1, margin: '25px 0', opacity: 1 }} />
            

            <p className="font-lato" style={{ fontSize: 20, lineHeight: 1.25 }}>
              Inquiry Journeys, inquirED's elementary social studies curriculum develops the 
              skills and builds the content knowledge students need to succeed.   
            </p>

          
            <button className="btn btn-outline-light mt-auto py-2 px-5 font-montserrat border-2 rounded-3">Learn More</button>
          </div>


          {/* ====================== */}


          <div className="col col-lg-4 d-none d-md-flex justify-content-center align-items-center">

            <img 
              className="d-block"
              style={{ 
                width: '100%',
                maxWidth: 350,
                objectFit: 'fill', 
              }}
              src="images/responsive-curriculum.png"
              alt="Inquiry-based supplies"
            />
          </div>
        </div>{/* End of <div className="row"> */}
      </div>{/* End of <div className="section-inner" */}
    </section>
  );
}
