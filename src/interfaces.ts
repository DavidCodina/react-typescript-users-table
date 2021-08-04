export interface User {
  id:              number;
  first_name:      string;
  last_name:       string;
  email:           string;
  verified:        boolean;
  middle_initial?: string | null;
  created_at:      string;
  district:        number;
  active:          boolean;
}


export interface District {
  id: number;
  name: string;
  city: string;
}


export type FlexibleFunction = (...args: any[]) => any;


export interface MainContextValue {
  users:         User[];
  setUsers:      React.Dispatch<React.SetStateAction<User[]>>;
  districts:     District[];
  [key: string]: any; 
}