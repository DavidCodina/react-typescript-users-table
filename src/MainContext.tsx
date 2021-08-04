import React, { createContext, useState, useEffect, useContext } from 'react';
import { MainContextValue, User, District }                      from './interfaces';
import axios                                                     from 'axios';


/* =========================================================================
                           
========================================================================= */


export const MainContext  = createContext({} as MainContextValue);
export const MainConsumer = MainContext.Consumer;


export const MainProvider = (props: { children: React.ReactNode }) => {
  const [ users,     setUsers ]     = useState<User[]>([]);
  const [ districts, setDistricts ] = useState<District[]>([]);


  useEffect(() => {
    // axios.get('http://localhost:3000/data/users.json')
    axios.get('data/users.json')
    .then(res  => { setUsers([ ...res.data ]); })
    .catch(err => { console.log(err);          });
  }, []);


  useEffect(() => {
    // axios.get('http://localhost:3000/data/districts.json')
    axios.get('data/districts.json')
    .then(res => { setDistricts([ ...res.data ]); })
    .catch(err => { console.log(err); });
  }, []);


  return (
    <MainContext.Provider value={{ users, setUsers, districts }}>
      { props.children }
    </MainContext.Provider>
  );
};


export function useMainContext(){
  const value = useContext(MainContext);
  return value;
}