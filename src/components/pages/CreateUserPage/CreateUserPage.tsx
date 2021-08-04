import React                   from 'react'; 
import { RouteComponentProps } from 'react-router-dom';
import { MainContextValue }    from '../../../interfaces';
import { CreateUserForm }      from './CreateUserForm';


interface CreateUserPageProps extends RouteComponentProps  {
  value: MainContextValue;
}


/* ========================================================================

======================================================================== */


export function CreateUserPage(props: CreateUserPageProps): React.ReactElement | null {
  const { value }           = props;
  const { users, setUsers } = value;

  return (
    <div className="flex-grow-1">
      <div className="container-fluid pt-5 px-md-5">
        <h2 className="mb-5 text-white-3d text-center">Create User</h2>

        <CreateUserForm users={users} setUsers={setUsers} />
      </div>
    </div>
  );
}
