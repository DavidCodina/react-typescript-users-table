import React, { useState, useEffect } from 'react';
import { useMainContext }             from '../../../MainContext';
import { User }                       from '../../../interfaces';
import { dateObjectToSqlTimestamp }   from '../../../helpers/date-helpers';
import { Feedback }                   from './Feedback';
import { Alert, Icon }                from '../../shared'; 


interface CreateUserFormProps {
  users:    User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

interface ObjectWithMessage {
  message: string;
}

interface MutationResponse {
  data?:      ObjectWithMessage;
  error?:     ObjectWithMessage;
  status:     number;
  statusText: string;
}


//! Duplicate
function hasCorrectFormat(value: string, regex: RegExp){
  if (!regex.test(value)){ return false; }
  return true;
}


/* ==========================================================================

========================================================================== */


export const CreateUserForm = ({ users, setUsers }: CreateUserFormProps) => {
  const { districts }                                     = useMainContext();
  const [ firstName,        setFirstName ]                = useState('');
  const [ firstNameError,   setFirstNameError ]           = useState('');
  const [ firstNameTouched, setFirstNameTouched ]         = useState(false);

  const [ lastName,        setLastName ]                  = useState('');
  const [ lastNameError,   setLastNameError ]             = useState('');
  const [ lastNameTouched, setLastNameTouched ]           = useState(false);

  const [ middleInitial,        setMiddleInitial ]        = useState('');
  const [ middleInitialError,   setMiddleInitialError ]   = useState('');
  const [ middleInitialTouched, setMiddleInitialTouched ] = useState(false);

  const [ email,        setEmail ]                        = useState('');
  const [ emailError,   setEmailError ]                   = useState('');
  const [ emailTouched, setEmailTouched ]                 = useState(false);

  // Radios do not need a touched state.
  const [ active,      setActive]                         = useState('');
  const [ activeError, setActiveError ]                   = useState('');

  // <select>s do not need a touched state.
  const [ district,        setDistrict ]                  = useState('');
  const [ districtError,   setDistrictError ]             = useState('');
  const [ districtOptions, setDistrictOptions]            = useState<React.ReactNode | null>(null);


  // This state is used to track the API request when sending newUser to a server.
  // Obviously, we're not doing that here, but its still good to build it out.
  const [ loading,   setLoading ]   = useState(false); 
  const [ data,      setData ]      = useState<ObjectWithMessage | null>(null); 
  const [ error,     setError ]     = useState<ObjectWithMessage | null>(null); 
  const [ isSuccess, setIsSuccess ] = useState(false); 
  const [ isError,   setIsError ]   = useState(false); 
  

  /* ===========================

  =========================== */

 
  function validateFirstName(e: React.ChangeEvent<HTMLInputElement> | undefined){
    const value = (e && e.target) ? e.target.value : firstName; 

    if (value.length === 0){
      setFirstNameError('First name is required!');
      return false; 
    } 

    if (!hasCorrectFormat(value, /^[a-zA-Z]*$/)){
      setFirstNameError('First name must be only letters!');
      return false;
    }

    setFirstNameError('');
    return true;
  }


  /* ===========================

  =========================== */


  function validateLastName(e: React.ChangeEvent<HTMLInputElement> | undefined){
    const value = (e && e.target) ? e.target.value : lastName; 

    if (value.length === 0){
      setLastNameError('Last name is required!');
      return false; 
    } 

    if (!hasCorrectFormat(value, /^[a-zA-Z]*$/)){
      setLastNameError('Last name must be only letters!');
      return false;
    }

    setLastNameError('');
    return true;
  }


  /* ===========================

  =========================== */


  function validateMiddleInitial(e: React.ChangeEvent<HTMLInputElement> | undefined){
    const value = (e && e.target) ? e.target.value : middleInitial; 

    if (value.length > 1){
      setMiddleInitialError('Middle initial must be only one letter!');
      return false; 
    } 

    if (value.length === 1 && !hasCorrectFormat(value, /^[a-zA-Z]$/)){
      setMiddleInitialError('Middle initial must be a letter!');
      return false;
    }

    setMiddleInitialError('');
    return true;
  }


  /* ============================

  ============================ */


  function validateEmail(e: React.ChangeEvent<HTMLInputElement> | undefined){
    const value = (e && e.target) ? e.target.value : email;

    if (value.length === 0){
      setEmailError('Email required!');
      return false; 
    } 

    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
    const regex   = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // eslint-disable-line
    const isEmail = hasCorrectFormat(value, regex);

    if (!isEmail){
      setEmailError('Must be an email!');
      return false; 
    } 

    setEmailError('');
    return true;
  }


  /* ============================

  ============================ */


  function validateActive(e: React.ChangeEvent<HTMLInputElement> | undefined){
    const value = (e && e.target) ? e.target.value : active; 

    if (value.length === 0){
      setActiveError('Active required!');
      return false; 
    } 

    setActiveError('');
    return true;
  }


  /* ============================

  ============================ */


  function validateDistrict(e: React.ChangeEvent<HTMLSelectElement> | undefined){
    const value = (e && e.target) ? e.target.value : district; 

    if (value.length === 0){
      setDistrictError('District is required!');
      return false; 
    } 

    setDistrictError('');
    return true;
  }


  /* ============================

  ============================ */


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); // Not actually necessary since using type="button"/onClick
    let formIsValid  = true;
    const validators = [
      validateFirstName, 
      validateLastName, 
      validateMiddleInitial, 
      validateEmail,
      validateActive, 
      validateDistrict
    ];


    // Validate fields...
    for (let i = 0; i < validators.length; i++){
      const validator = validators[i];
      const isValid   = validator(undefined); // eslint-disable-line
      if (!isValid){ formIsValid = false; }
    }


    if (formIsValid){  
      // Technically, CreateUserForm doesn't need to know about users.
      // However, for this demo I've decided to set the newUser.id to
      // users[users.length-1].id + 1. I could've gone with uuid, but this also works.
      // The next 3 lines are being used to fake the successful response data.
      // Normally, there would be no need to store them in constants.
      const id    = users[users.length-1].id + 1;
      const fName = firstName;
      const lName = lastName;

    
      const newUser:User = {
        id:             id,
        first_name:     firstName,
        last_name:      lastName,
        middle_initial: middleInitial ? middleInitial : null,
        email:          email,
        active:         active === 'true' ? true : false,
        district:       parseInt(district, 10),
        verified:       false,                              
        created_at:     dateObjectToSqlTimestamp(new Date()) // Seems like this should be done on the server... 
      };                                                     


      // Make an API request to update users on the server.
      setLoading(true);
      setError(null);
      setIsError(false);


      try {
        // Artificial delay to test button spinner
        await new Promise((resolveFx, rejectFx) => setTimeout(resolveFx, 1500)); 


        const mutationResponse: MutationResponse = await new Promise((resolveFx, rejectFx) => {
          resolveFx({ // Pretend the API is responding with name and id.
            data: { message: `${fName} ${lName} was created with an id of ${id}.` }, 
            status: 200,
            statusText: "OK"
          });
        });


        //# Comment above mutationResponse and uncomment this to mock failed request.
        // const mutationResponse: MutationResponse = await new Promise((resolveFx, rejectFx) => {
        //   resolveFx({ 
        //     error: { message: "Unable to create new user." }, 
        //     status: 400,
        //     statusText: "Bad Request"
        //   });
        // });
        // // In practice, a bad request would automatically get sent to catch block,
        // // but in this demo we have to force it.
        // if (mutationResponse.error){ throw mutationResponse; }
        

        // Update request state.
        // In this demo when isSuccess && data (e.g. mutation response data),
        // then an <Alert /> is conditionally rendered which indicates success.
        // Upon closing that <Alert /> isSuccess is set to false, and data back to null.
        // In other words, setting that state closes the success <Alert />


        setLoading(false);
        setIsSuccess(true);
        if (mutationResponse.data){ setData(mutationResponse.data); }


        // Reset form
        setFirstName('');
        setLastName('');
        setMiddleInitial('');
        setEmail('');
        setActive(''); 
        setDistrict('');


        // Untouch some input fields (not type="checkbox", type="radio", type="file").
        setFirstNameTouched(false);
        setLastNameTouched(false);
        setMiddleInitialTouched(false);
        setEmailTouched(false);


        // At this point the users 'cached' in global state will be out of sync;
        // A new request must be made for the updated users.
        // Since we're not actually interacting with an API, we will
        // optimistically update here, and skip the API part.
        setUsers(currentUsers => [...currentUsers, newUser]);
      } 
      
      catch (err){
        setLoading(false);
        if (err.error){
          setIsError(true);
          setError(err.error);
        }        
      } 
    } 
    
    
    // Otherwise, if the form is NOT valid...
    else {
      // Touch some input fields (not type="checkbox", type="radio", type="file"):
      setFirstNameTouched(true);
      setLastNameTouched(true);
      setMiddleInitialTouched(true);
      setEmailTouched(true);
    }
  }


  /* ============================

  ============================ */


  useEffect(() => {
    const districtOptions = districts.map(district => <option key={district.id} value={district.id}>{district.name}</option>) 
    setDistrictOptions(districtOptions);
  }, [districts]);


  /* ============================
      renderSubmitButton()
  ============================ */


  const renderSubmitButton = () =>{
    if (loading){
      return (
        <button className="d-block w-100 btn btn-green font-montserrat" type="button" disabled>
          <span className="spinner-border spinner-border-sm me-3" role="status" aria-hidden="true"></span>
          Submitting...
        </button>
      );
    }

    return (
      <button 
        className="d-block w-100 btn btn-green font-montserrat" 
        type="button"
        onClick={handleSubmit}
      >Submit</button>
    );
  };


  /* ============================
           renderAlert()
  ============================ */
  // Render success alert when user is successfully uploaded.
  // Render failure alert when user is not successfully uploaded.


  const renderAlert = () => { 
    if (isError && error){ // Check both of these just in case the state updates aren't simultaneously batched. 
      return (
        <Alert 
          color="red"               
          className="border-2 shadow" 
          style={{}}            
          headerContent={             
            <h4 className="alert-heading mb-3 font-montserrat">
              <Icon name="exclamation-triangle-fill" size={28} />
              Whoops!
            </h4>
          }
          bodyContent={ 
            <React.Fragment>
              <p className="font-montserrat">{ error.message ? error.message : 'Could not create new user.'}</p>
              <button 
                className={`d-block mx-auto btn btn-red font-montserrat shadow-sm`} 
                style={{ minWidth: 100 }} 
                onClick={() => {
                  setError(null);
                  setIsError(false);
                }}
              >Close</button>
            </React.Fragment>
          }

          showCloseButton={true}                    
          closeButtonFunction={() => {
            setError(null);
            setIsError(false);
          }} 
        />
      );
    }


    if (isSuccess && data){ // Check both of these just in case the state updates aren't simultaneously batched. (???)
      return (
        <Alert 
          color="green"              
          className="border-2 shadow" 
          style={{}}               
          headerContent={          
            <h4 className="alert-heading mb-3 font-montserrat">
              <Icon name="check-circle-fill" size={28} style={{ marginRight: 5 }} />
              Success!
            </h4>
          }
          bodyContent={ 
            <React.Fragment>
              <p className="font-montserrat">{ data.message ? data.message : 'The user has been created.'}</p>
              <button 
                className={`d-block mx-auto btn btn-green font-montserrat shadow-sm`} 
                style={{ minWidth: 100 }} 
                onClick={() => {
                  setData(null);
                  setIsSuccess(false);
                }}
              >Close</button>
            </React.Fragment>
          }

          showCloseButton={true}                    
          closeButtonFunction={() => {
            setData(null);
            setIsSuccess(false);
          }} 
        />
      );
    }

    return null;
  };


  /* ============================

  ============================ */


  return (
    <React.Fragment>
      <form 
        className="mx-auto mb-5 p-3 bg-light border border-green border-2 rounded-3 shadow" 
        style={{ maxWidth: 700 }}
        autoComplete="off"
        noValidate
      >
        <div className="mb-3">
          <label className="mb-2 font-montserrat text-green" htmlFor="first-name">First Name:<sup className="text-pink"> *</sup></label>
          <input 
            // This will still not work if id="name". The real solution is to change the id.
            // autoComplete="turn-off-for-real" 
            id="first-name"
            className={`form-control${firstNameError ? ' is-invalid' : ''}`}
            autoComplete="turn-off-for-real"
            type="text" 
            placeholder="First name..." 
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (firstNameTouched){ validateFirstName(e); }
            }}
            onBlur={(e) => {
              if (!firstNameTouched){ validateFirstName(e); }
              setFirstNameTouched(true);
            }}
          />
          <Feedback error={firstNameError} />
        </div>


        {/* ======================= */}


        <div className="mb-3">
          <label className="mb-2 font-montserrat text-green" htmlFor="last-name">Last Name:<sup className="text-pink"> *</sup></label>
          <input 
            id="last-name"
            className={`form-control${lastNameError ? ' is-invalid' : ''}`}
            autoComplete="turn-off-for-real"
            type="text" 
            placeholder="Last name..." 
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (lastNameTouched){ validateLastName(e); }
            }}
            onBlur={(e) => {
              if (!lastNameTouched){ validateLastName(e); }
              setLastNameTouched(true);
            }}
          />
          <Feedback error={lastNameError} />
        </div>


        {/* ======================= */}


        <div className="mb-3">
          <label className="mb-2 font-montserrat text-green" htmlFor="middle-initial">Middle Initial:</label>
          <input 
            id="middle-initial"
            className={`form-control${middleInitialError ? ' is-invalid' : ''}`}
            autoComplete="turn-off-for-real"
            type="text" 
            placeholder="Middle Initial..." 
            value={middleInitial}
            onChange={(e) => {
              setMiddleInitial(e.target.value);
              if (middleInitialTouched){ validateMiddleInitial(e); }
            }}
            onBlur={(e) => {
              if (!middleInitialTouched){ validateMiddleInitial(e); }
              setMiddleInitialTouched(true);
            }}
          />
          <Feedback error={middleInitialError} />
        </div>


        {/* ======================= */}

        
        <div className="mb-3">
          <label className="mb-2 font-montserrat text-green" htmlFor="e-mail">Email:<sup className="text-pink"> *</sup></label>

          <input 
            // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
            // Even though autoComplete="off" was set on the form, Chrome will read the value of the label, id, and/or name attribute.
            // name attribute values like "address", 'email', 'name' - will be autocompleted.
            // This will NOT work if id="email"
            autoComplete="turn-off-for-real"
            id="e-mail"
            className={`form-control${emailError ? ' is-invalid' : ''}`}
            type="email" 
            placeholder="Email..." 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailTouched){ validateEmail(e); }
            }}
            onBlur={(e) => {
              if (!emailTouched){ validateEmail(e); }
              setEmailTouched(true);
            }}
          />

          <Feedback error={emailError} />
        </div>


        {/* ======================= */}


        <div className="mb-3">
          <label className="mb-2 font-montserrat text-green">Active Status:<sup className="text-pink"> *</sup></label>
        
          <div className="form-check"> 
            <input 
              id="active-1"  
              className={`form-check-input${activeError ? ' is-invalid' : ''}`} 
              type="radio" 
              value="true" 
              name="active" 
              onChange={(e) => { 
                setActive(e.target.value); 
                validateActive(e);
              }}
              checked={active === "true"}
            /> 

            <label htmlFor="active-1" className={`form-check-label${activeError ? ' text-red' : ''}`}>True</label>
          </div>
          

          <div className="form-check"> 
            <input 
              id="active-2"  
              className={`form-check-input${activeError ? ' is-invalid' : ''}`} 
              type="radio" 
              value="false" 
              name="active" 
              onChange={(e) => { 
                setActive(e.target.value); 
                validateActive(e);
              }}
              checked={active === "false"}
            /> 
            <label htmlFor="active-2" className={`form-check-label${activeError ? ' text-red' : ''}`}>False</label>

            <Feedback error={activeError} />
          </div>    
        </div>


        {/* ======================= */}


        <div className="mb-3">
          <label className="mb-2 font-montserrat text-green" htmlFor="district">District:<sup className="text-pink"> *</sup></label>
          <select 
            id="district"
            className={
              `form-select${district === "" ? ' text-gray' : ''}${districtError ? ' is-invalid' : ''}`
            }
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              validateDistrict(e);
            }}
            onBlur={(e) => validateDistrict(e) }
          >
            <option value="">Select District</option>
            { districtOptions }
          </select>

          <Feedback error={districtError} />
        </div>


        {/* ======================= */}


        { renderSubmitButton() }  
      </form>

      { renderAlert() }
    </React.Fragment>
  );
};

