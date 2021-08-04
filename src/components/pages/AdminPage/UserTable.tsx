import React, { useState, useEffect, useRef } from 'react';
import { User }            from '../../../interfaces';
import { sqlTimestampToFormattedDate, formattedDateToSqlTimestamp } from '../../../helpers/date-helpers';
import { TableRow }        from './TableRow';
import { Alert, Icon }     from '../../shared'; 
import { Filter }          from './Filter';


//! Duplicate
function hasCorrectFormat(value: string, regex: RegExp){
  if (!regex.test(value)){ return false; }
  return true;
}


/* ========================================================================

======================================================================== */


interface FlexibleUser {
  id:              number | string;
  first_name:      string;
  last_name:       string;
  email:           string;
  verified:        boolean | string;
  middle_initial?: string  | null;
  created_at:      string;
  district:        number  | string;
  active:          boolean | string;
}


interface UserTableProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}


/* ========================================================================

======================================================================== */


const UserTable = (props: UserTableProps):React.ReactElement | null => {
  const { users, setUsers }                 = props;
  const [ filteredUsers, setFilteredUsers ] = useState<User[]>([]); // Set from within <Filter />
  const [ deletedUserId, setDeletedUserId ] = useState<string | number | null>(null);
  const [ errors,        setErrors ]        = useState<string[]>([]);
  const columnData                          = ["ID", "Last Name", "First Name", "M.I.", "Email", "District", "Verified", "Created", "Active", ""];
  const hasMounted                          = useRef(false);


  ///////////////////////////////////////////////////////////////////////////////////
  //
  //  hasMounted.current is used as a conditional flag for preventing
  //  an <Alert /> from showing on mount when users is populated, but 
  //  filtered users has yet to be set, as an alternative, you could do this here:
  //  React.useLayoutEffect(() => { setFilteredUsers([ ...users]); }, [users]);
  //
  ///////////////////////////////////////////////////////////////////////////////////

  
  useEffect(() => {
    if (hasMounted.current === false){
      hasMounted.current = true;
    }
  }, []);


  /* ========================
        validateUser()
  ======================== */
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //  1. validateUser() receives a FlexibleUser object.
  //  2. Each value in that object (except id) is validated.
  //  3. If a validation test fails, an error string is pushed to the errors array.
  //  4A. If there are no errors, a validUser is returned
  //  4B. If there are errors then setErrors(errors);
  //
  //  The validation patterns here are not exactly the same as those used in
  //  CreateNewUser.tsx, but they very closely resemble them.
  //
  ///////////////////////////////////////////////////////////////////////////////////


  const validateUser = (rowData: FlexibleUser): User | void => {
    const errors:string[] = [];
    // id is not validated because admin is disallowed from modifying it.
    let verified:   boolean | undefined;
    let created_at: string  | undefined;
    let active:     boolean | undefined;


    if (rowData.last_name.trim().length === 0){
      errors.push("Last name is required.");
    } else if (!hasCorrectFormat(rowData.last_name, /^[a-zA-Z]*$/)){
      errors.push("Last name must be only letters.");
    }

    /* ===================== */

    if (rowData.first_name.trim().length === 0){
      errors.push("First name is required.");
    } else if (!hasCorrectFormat(rowData.first_name, /^[a-zA-Z]*$/)){
      errors.push("First name must be only letters.");
    }

    /* ===================== */


    if (typeof rowData.middle_initial === 'string'){
      const isASingleLetter = hasCorrectFormat(rowData.middle_initial, /^[a-zA-Z]$/);

      if (rowData.middle_initial.length > 1){
        errors.push("Middle initial must only be one character.");
      } else if (rowData.middle_initial.length === 1 && !isASingleLetter){
        errors.push("Middle initial must be a letter!");
      }
    }

    /* ===================== */

    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // eslint-disable-line
    const isEmail    = hasCorrectFormat(rowData.email, emailRegex);

    if (rowData.email.trim().length === 0){
      errors.push("Email is required.");
    } else if (!isEmail){ 
      errors.push("Must be an email!"); 
    } 

    /* ===================== */

    const isPositiveInteger = hasCorrectFormat(rowData.district as string, /^[0-9]*$/);
    if (!isPositiveInteger){ 
      errors.push("District must be a positive integer!"); 
    } 

    /* ===================== */

    if (rowData.verified.toString().toLowerCase() === 'true' || rowData.verified.toString().toLowerCase() === 't'){
      verified = true;
    } else if (rowData.verified.toString().toLowerCase() === 'false' || rowData.verified.toString().toLowerCase() === 'f'){
      verified = false;
    } else {
      errors.push("The Verified field must be 'True' or 'False'.");
    }

    /* ===================== */

    const dateRegex   = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s(0?[1-9]|[1-2][0-9]|3[0-1]),?\s(19|20)\d{2}(\s([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?)?$/i;
    created_at        = rowData.created_at.trim(); // Allows for a little bit more flexibility without erroring.
    const dateIsValid = dateRegex.test(created_at);


    if (!dateIsValid){
      // Expected behavior: an error alert will show up in the UI, and the date
      // will revert back to what it was previously.
      errors.push("The date should be formatted as: 'month day, year HH:MM:SS'.");
    } else {
      // Expected behavior: submitting "August 1, 2021 00:00:00" / "August 1, 2021 00:00" / "August 1, 2021" / "August 1 2021"
      // will create a value of: "2021-08-01 06:00:00", and will rerender
      // in the browser as "August 1, 2021 00:00:00"
      created_at = formattedDateToSqlTimestamp(created_at);
    } 

    /* ===================== */

    if (rowData.active.toString().toLowerCase() === 'true' || rowData.active.toString().toLowerCase() === 't'){
      active = true;
    } else if (rowData.active.toString().toLowerCase() === 'false' || rowData.active.toString().toLowerCase() === 'f'){
      active = false;
    } else {
      errors.push("The Active field must be 'True' or 'False'.");
    }

    /* ===================== */

    if (errors.length === 0 && typeof verified !== 'undefined' && typeof created_at !== 'undefined'  && typeof active !== 'undefined'){
      const validUser:User = { 
        id:         parseInt(rowData.id as string),
        first_name: rowData.first_name, 
        last_name:  rowData.last_name, 
        middle_initial: typeof rowData.middle_initial === 'string' && rowData.middle_initial.length > 0 ? rowData.middle_initial.toUpperCase() : null,
        email:      rowData.email,
        verified:   verified,
        created_at: (created_at as unknown as string), // Temporary hack.
        district:   parseInt(rowData.district as string, 10),
        active: active
      };
      return validUser;
    } 

    setErrors(errors);
  };


  /* ========================
          editUser()
  ======================== */


  const editUser = (updatedUser: User): void => {
    const newUsers      = [ ...users];
    // Get user index by id:
    // https://stackoverflow.com/questions/10557486/in-an-array-of-objects-fastest-way-to-find-the-index-of-an-object-whose-attribu
    const userIndex     = newUsers.map(user => user.id).indexOf(updatedUser.id);
    newUsers[userIndex] = updatedUser;
    setUsers(newUsers);
    setFilteredUsers(newUsers);
  };


  /* ========================
          deleteUser()
  ======================== */


  const deleteUser = (): void => {
    if (!deletedUserId){ return; }

    // Optimistically update users. Then only revert back if API request is 'unsuccessful'.
    // Unlike in CreateUserForm, I did not mock out the API flow here.
    const newUsers = users.filter(user => user.id !== deletedUserId);

    ///////////////////////////////////////////////////////////////////////////////////
    //
    //  It's pretty safe to assume that newUsers has successfully filtered
    //  out the user with the given userId. We could add a check to compare
    //  the length of newUsers to users. However, we would then have to be
    //  sure that the application wasn't updating users somewhere else
    //  (e.g., another person messing with the database).
    //  In practice, the confirmation would normally come from an API response.
    //
    ///////////////////////////////////////////////////////////////////////////////////
    setUsers(newUsers);
    setDeletedUserId(null);
  };


  /* ========================
        renderTable()
  ======================== */


  const renderTable = () => {
    if (filteredUsers.length > 0){
      return (
        <table id="user-table" className="table table-bordered custom-table-hover custom-table-striped mx-auto mb-5 mx-auto text-center shadow-sm">
          <thead>
            <tr>
              { columnData.map((columnHeader, index) => <th key={index} className="px-1 py-2">{ columnHeader }</th>) }
            </tr>
          </thead>
        
          <tbody>
            { 
              filteredUsers.map(user => {
                const { id, last_name, first_name, email, district } = user;
                const middle_initial = user.middle_initial ? user.middle_initial : '';
                const verified       = user.verified ? 'True' : 'False';
                const created_at     = sqlTimestampToFormattedDate(user.created_at);
                const active         = user.active ? 'True' : 'False';
                const row            = { id,   last_name,   first_name,   middle_initial,   email,   district,   verified,   created_at,   active }; // Could instead implement with Map
                const columnOrder    = ["id", "last_name", "first_name", "middle_initial", "email", "district", "verified", "created_at", "active" ]
                

                return (
                  <TableRow 
                    key={user.id} 
                    rowData={row} 
                    columnData={columnData}
                    columnOrder={columnOrder}
                    validateRow={validateUser}
                    editRow={editUser}
                    deleteRow={() => setDeletedUserId(id)}
                  />
                );
              })
            }
          </tbody> 
        </table>
      );
    } 

    return null;
  };


  /* ========================
        renderAlert()
  ======================== */
  // Conditionally render an alert for confirming user deletion and for editing errors.


  const renderAlert = () => {
    if (errors.length > 0){
      return (
        <Alert 
          color="red"                 // Default: 'gray'
          className="border-2 shadow" // Default: '
          style={{}}                  // Default: {}
          headerContent={             // Default : null
            <h4 className="alert-heading mb-3 font-montserrat">
              <Icon name="exclamation-triangle-fill" size={28} />
              Whoops!
            </h4>
          }
          bodyContent={ // Default : null
            <React.Fragment>
              <ul className="child-mb-2">
                { errors.map((error, index) => <li key={index} className="font-montserrat">{ error }</li>) }
              </ul>

              <p className="font-montserrat">All values for that row have reverted to their original state prior to editing.</p>

              <button 
                className={`d-block mx-auto btn btn-red font-montserrat shadow-sm`} 
                style={{ minWidth: 100 }} 
                onClick={() => setErrors([])}
              >Close</button>
            </React.Fragment>
          }

          showCloseButton={true}                    // Default : true
          closeButtonFunction={() => setErrors([])} // No default
        />
      );
    }

    if (deletedUserId || deletedUserId === 0){
      return (
        <Alert 
          color="red"              
          className="border-2 shadow" 
          style={{}}                 
          headerContent={          
            <h4 className="alert-heading mb-3 font-montserrat">
              <Icon name="exclamation-triangle-fill" size={28} />
              Warning!
            </h4>
          }
          bodyContent={ 
            <React.Fragment>
              <p className="font-montserrat">Are you sure you want to delete user {deletedUserId}?</p>

              <div className="d-flex justify-content-between mx-auto" style={{ maxWidth: 250 }}>
                <button 
                  className={`d-block mx-auto btn btn-red font-montserrat shadow-sm`} 
                  style={{ minWidth: 100 }} 
                  onClick={() => setDeletedUserId(null)}
                >Cancel</button>

                <button 
                  className={`d-block mx-auto btn btn-green font-montserrat shadow-sm`} 
                  style={{ minWidth: 100 }} 
                  onClick={deleteUser}
                >Confirm</button>
              </div> 
            </React.Fragment>
          }

          showCloseButton={true}                          
          closeButtonFunction={() => setDeletedUserId(null)} 
        />
      );
    }

    if (users.length > 0 && filteredUsers.length === 0 && hasMounted.current === true){ 
      // One could pass in function so that button resets filters, unmounting <Alert />.
      return (
        <Alert 
          color="red"                   
          className="border-2 shadow" 
          style={{ position: 'relative', top: 25, transform: 'translateX(-50%)' }}                   
          headerContent={            
            <h4 className="alert-heading mb-3 font-montserrat">
              <svg fill="currentColor" viewBox="0 0 16 16" style={{ maxWidth: 28, verticalAlign: 'top' }}>
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              Whoops!
            </h4>
          }
          bodyContent={<p className="my-4 font-montserrat text-center">It looks like there are no users based on that criteria.</p>}
          showCloseButton={false}                      
        />
      );
    }

    return null;
  };


  /* ========================
            return
  ======================== */


  return (
    <React.Fragment>
      <Filter users={users} setFilteredUsers={setFilteredUsers} />
      { renderTable() }
      { renderAlert() } 
    </React.Fragment>
  );
};


export default UserTable;






