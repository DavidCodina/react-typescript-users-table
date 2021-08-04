import React, { useState, useEffect } from 'react';
import { User }                       from '../../../interfaces';


type ObjectAsAny<Type extends {}> = { 
  [Property in keyof Type]: any;
};


interface TableRowProps<T> {
  rowData:      T;
  columnData:   string[];
  columnOrder:  string[],
  validateRow?: (rowData: ObjectAsAny<T>) => User | void; //! 
  editRow?:     (rowData: User) => void;                  //! 
  deleteRow?:   () => void; 
}


/* ========================================================================

======================================================================== */


export function TableRow<T extends {}>(props: TableRowProps<T>):React.ReactElement | null {
  const {  rowData: data, columnOrder, columnData, validateRow, editRow, deleteRow } = props;
  const [ rowData,    setRowData ]    = useState({ ...data });
  const [ readOnly,   setReadOnly ]   = useState(true);
  const [ errorStyle, setErrorStyle ] = useState('');


  const toggleEdit = () => {
    const isUnlockingRow = readOnly;
    const isLockingRow   = !readOnly;

    if (isUnlockingRow){
      setReadOnly(false);
    }
    
    else if (isLockingRow && editRow){ 
      const validRow = (typeof validateRow === "function") && validateRow(rowData);

      if (validRow){
        setReadOnly(true);
        setErrorStyle('');
        editRow(validRow); 
      } else {
        setErrorStyle('is-error');
      }
    } 
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRowData                    = { ...rowData };
    const propertyName                  = e.target.name;
    const value                         = e.target.value;
    newRowData[propertyName as keyof T] = value as unknown as T[keyof T];  
    setRowData(newRowData);
  };
  

  // Used to dynamically resize input width based on input value length.
  const calculateInputSize = (datum: any) => {
    const idealSize       = (datum.toString().length) + 1; //! For some reason it needs the + 1.
    const constrainedSize = idealSize > 30 ? 30  : idealSize;
    return constrainedSize;
  };


  // Anytime TableRow is passed new data, update local rowData with data.
  useEffect(() => { setRowData({ ...data }); }, [data]);


  return (
    <React.Fragment>
      <tr className={errorStyle}>
        { 
          columnOrder.map((propertyName, index) => {
            const datum = rowData[propertyName as keyof typeof rowData];
            const size  = calculateInputSize(datum);
            const isID  = (propertyName.toLowerCase() === 'id' || propertyName.toLowerCase() === '_id');
            

            // Disallow id from being editable.
            const inputClassName = () => {
              if (isID){ return 'form-control-plaintext'; }
              return readOnly ? 'form-control-plaintext' : 'form-control border-gray'
            };


            return (
              <td key={index} className="align-middle p-1">
                <span className="column-data">{ columnData[index] }:</span>

                <input 
                  className={inputClassName()}
                  readOnly={isID ? true : readOnly} 
                  type="text" 
                  name={propertyName}
                  value={ (datum as unknown as string | number | readonly string[] | undefined) }
                  onChange={(e) => handleChange(e, index) }
                  size={size}
                />  
              </td>
            );
          }) 
        }

        {
          (editRow || deleteRow) && (
            <td className="align-middle">
              <div className="function-button-container">
              { editRow   && <button className={`btn btn-blue btn-sm font-montserrat shadow-sm${deleteRow ? ' me-2' : ''}`} style={{ minWidth: 75 }} onClick={toggleEdit}>Edit</button> }
              { deleteRow && <button className="btn btn-red btn-sm font-montserrat shadow-sm"                               style={{ minWidth: 75 }} onClick={() => deleteRow()}>Delete</button> }
              </div> 
            </td>
          ) 
        }
      </tr>  
    </React.Fragment> 
  );
}



