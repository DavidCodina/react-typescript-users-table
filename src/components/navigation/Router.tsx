import React                from 'react';
import { MainContextValue } from '../../interfaces';
import { Route, Switch }    from 'react-router-dom';
import { HomePage }         from '../pages/HomePage';
import { AdminPage }        from '../pages/AdminPage';
import { CreateUserPage }   from '../pages/CreateUserPage';
import NotFoundPage         from '../pages/NotFoundPage';


interface RouterProps {
  value: MainContextValue;
}


export function Router({ value }: RouterProps){
  return (
    <Switch>  
      <Route 
        exact path="/"
        render={(props) => {
          return <HomePage {...props} value={value} />;
        }}
      />

      <Route 
        exact path="/admin"
        render={(props) => {
          return <AdminPage {...props} value={value} />;
        }}
      />

      <Route 
        exact path="/createuser"
        render={(props) => {
          return <CreateUserPage {...props} value={value} />;
        }}
      />

      <Route component={NotFoundPage} />
    </Switch>
  );
}



