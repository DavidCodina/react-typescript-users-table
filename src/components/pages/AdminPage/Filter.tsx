import React, { useState, useEffect } from 'react';
import { useMainContext }             from '../../../MainContext';
import { User }                       from '../../../interfaces';
// The instructions specifically said to build a toggle that filtered
// active/inactive users. However, it made more sense to handle it in 
// a trinary manner: all | active | inactive.


/* ========================================================================

======================================================================== */


interface FilterProps {
  users: User[];
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
}


/* ========================================================================

======================================================================== */


export const Filter = (props: FilterProps) => {
  const { districts } = useMainContext();

  const { users, setFilteredUsers }               = props;
  // An activeStatus of null is meant to correpond to All users.
  const [ activeStatus,     setActiveStatus ]     = useState< null | boolean>(null);
  const [ selectedDistrict, setSelectedDistrict ] = useState('all');


  const handleActiveStatusButtonClick = () => {
    if      (activeStatus === null){ setActiveStatus(true);  }
    else if (activeStatus === true){ setActiveStatus(false); }
    else {                           setActiveStatus(null);  }
  };


  /* ========================
          
  ======================== */
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //  Filter users by active status, and then store in usersFilteredByActiveStatus.
  //  Filter usersFilteredByActiveStatus by district, and then store in usersFilteredByActiveStatusAndDistrict.
  //  Iniitally I used useLayoutEffect, which runs synchronously to avoid a flash of 
  //  an <Alert /> message indicating that there are "no users based on that criteria". 
  //  The flash occurs on first mount. The downside is that there's a slight delay 
  //  when loading the Admin page, and the console warns: [Violation] 'click' handler took 168ms
  // 
  //  A better approach is to implement hasMounted = useRef(true false); inside of UserTable.tsx. 
  //  Then inside of a useEffect, update it on mount. Then in the JSX use hasmounted.current as a
  //  flag to indicate whether or not it is okay to show the associated <Alert />:
  //  if (users.length > 0 && filteredUsers.length === 0 && hasMounted.current === true){ ... }
  //
  //  This is the best approach, and avoids the blocking behavior associated with useLayoutEffect.
  //  That said, running useLayoutEffect FROM UserTable.tsx is another alternative, and cleaner,
  //  than running it here:
  //
  //    useLayoutEffect(() => { setFilteredUsers([ ...users]); }, [users]);
  //  
  ///////////////////////////////////////////////////////////////////////////////////////////////////


  useEffect(() => {
    let usersFilteredByActiveStatus:            User[] = [];
    let usersFilteredByActiveStatusAndDistrict: User[] = [];

    // Filter users by active status. An activeStatus of null 
    // corresponds users without any filtering by active status.
    if (activeStatus === null){
      usersFilteredByActiveStatus = users;
    } else {
      usersFilteredByActiveStatus = users.filter(user => user.active === activeStatus);
    }


    // Filter usersFilteredByActiveStatus by district.
    // Remember that in this App user.id is type number,
    // but form fields convert numbers to strings.
    if (selectedDistrict === 'all'){
      usersFilteredByActiveStatusAndDistrict = usersFilteredByActiveStatus;
    } else {
      usersFilteredByActiveStatusAndDistrict = usersFilteredByActiveStatus.filter(user => user.district === parseInt(selectedDistrict, 10));
    }

    setFilteredUsers(usersFilteredByActiveStatusAndDistrict);
  }, [users, activeStatus, selectedDistrict, setFilteredUsers]);


  /* ========================
          
  ======================== */


  return (
    <React.Fragment>
      <div className="d-flex justify-content-center align-items-center flex-wrap text-nowrap mb-4">
        <div className="mb-3">
          <label className="me-2 text-gray font-montserrat">Filter by Active Status:</label>
          <input
            className="btn btn-blue btn-sm me-4 font-montserrat shadow" 
            style={{ minWidth: 75 }}
            onClick={handleActiveStatusButtonClick}
            type="button"
            value={(activeStatus === null) ? 'All' : (activeStatus === true) ? 'Active' : 'Inactive'}
          />
        </div>


        <div className="mb-3">
          <label className="me-2 text-gray font-montserrat">Filter by District:</label>
          <select 
            className="form-select btn btn-blue btn-sm pe-4 font-montserrat text-truncate shadow" 
            style={{ maxWidth: 300, backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='4' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")` }}
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="all">All</option>
            { districts.map(district => <option key={district.id} className="text-truncate" value={district.id}>{district.name}</option>) }
          </select>
        </div>
      </div>
    </React.Fragment>    
  );
};
