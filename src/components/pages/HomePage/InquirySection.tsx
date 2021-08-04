import React             from 'react'; 
import { VerticalRuler } from '../../shared/VerticalRuler';


export function InquirySection(): React.ReactElement | null {
  return (
    <section 
      id="inquiry-section"
      className="position-relative py-5 px-3 p-sm-5 text-white" 
      style={{ backgroundColor: 'rgb(121, 139, 147)' }}
    >
      <VerticalRuler color="#FFF" className="d-none d-md-block" />


      {/* ====================== */}


      <div className="section-inner mx-auto" style={{ maxWidth: 1000 }}>
        <div className="row pt-5">
          <div className="col col-12 col-md-6 d-flex flex-column align-items-center px-5 ps-md-0 pe-md-5" style={{ minHeight: 500 }}>
            <img 
              className="d-block"
              style={{ 
                height: 125,
                marginBottom: 75,
                maxWidth: 250
              }}
              src="images/inquiry-journeys.png"
              alt="Inquiry_journeys_white.png" 
            />
     
            <h2 className="mb-5 font-montserrat">Begin Your Journey</h2>

            <p className="font-lato" style={{ fontSize: 20, lineHeight: 1.25 }}>
              Watch a demo. Start a conversation. Learn how inquirED's elementary social studies curriculum can 
              transform learning in your school or district.
            </p>

            <button 
              className="btn btn-outline-light mt-auto py-2 px-5 font-montserrat border-2 rounded-3"
              style={{ minWidth: 210 }}
            >Learn More</button>  
          </div>

          <div className="col col-12 d-md-none">
            <hr style={{ width: '90%', height: 1, margin: '75px auto', opacity: 1 }} />  
          </div>


          {/* ====================== */}


          <div className="col col-12 col-md-6 d-flex flex-column align-items-center px-5 ps-md-5 pe-md-0" style={{ minHeight: 500 }}>
            <img 
              className="d-block"
              style={{ height: 150, marginBottom: 50 }}
              src="images/inquiry-webinars.png"
              alt="webinar_white.png" 
            />
   
            <h2 className="mb-5 font-montserrat">Sign Up For a Webinar</h2>

            <p className="font-lato" style={{ fontSize: 20, lineHeight: 1.25 }}>
              Choose from a selection of monthly webinars to join in the conversation with 
              teachers and administrators across the country.
            </p>

            <button 
              className="btn btn-outline-light mt-auto py-2 font-montserrat border-2 rounded-3"
              style={{ minWidth: 210 }}
            >Upcoming Webinars</button>
          </div>

        </div>{/* End of <div className="row"> */}
      </div>{/* End of <div className="section-inner" */}
    </section>
  );
}
