import React                   from 'react'; 
import { RouteComponentProps } from 'react-router-dom';
import { MainContextValue }    from '../../../interfaces';
import UserTable               from './UserTable';


interface AdminPageProps extends RouteComponentProps {
  value: MainContextValue;
}


/* ========================================================================

======================================================================== */


export function AdminPage(props: AdminPageProps): React.ReactElement | null {
  const { value }           = props;
  const { users, setUsers } = value;

  return (
    <div className="flex-grow-1" style={{ backgroundColor: 'rgba(72, 74, 99, 0.1)'}}>
      <div className="container-fluid pt-5 px-md-5">
        <h2 className="mb-5 text-white-3d text-center">Admin</h2>
        <UserTable users={users} setUsers={setUsers} />
      </div>
    </div>
  );
}
