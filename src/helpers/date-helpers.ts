export function sqlTimestampToFormattedDate(string: string){
  // The created_at field in the JSON is an SQL-style timestamp, 
  // which is like an abbreviated ISO-8601, so we first need to rebuild it.
  const stringParts          = string.split(' ');
  const isoString            = `${stringParts[0]}T${stringParts[1]}.000Z`;
  const months               = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const date                 = new Date(isoString); 
  const year                 = date.getFullYear();
  let month:   number|string = date.getMonth()     
  const day                  = date.getDate();
  let hours:   number|string = date.getHours();
  let minutes: number|string = date.getMinutes();
  let seconds: number|string = date.getSeconds();
  
  month                              = months[month];
  const timeParts: (number|string)[] = [ hours, minutes, seconds ];
  
  for (let i = 0; i < timeParts.length; i++){
    let timePart: number|string = timeParts[i].toString();
  	if (timePart.length === 1){ timePart = `0${timePart}`; }
    timeParts[i] = timePart; 
  }

  hours   = timeParts[0];
  minutes = timeParts[1];
  seconds = timeParts[2];
  
  // Expected behavior: the formatted dates rendered in the UI will be offset by local timezone.
  return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`; 
}


/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////////////
//
//  This function works great, but it assumes it is receiving
//  the precise string format. In cases where it's not, it may actually break.
//  Consequently, any string passed into this function should first be tested against
//  the following regex:
//
//    const dateRegex = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s(0?[1-9]|[1-2][0-9]|3[0-1]),?\s(19|20)\d{2}(\s([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?)?$/i;
//
//  That said, I have still built the function such that it mitigates some potential issues
//  including extra spaces, etc. It could be improved further by allowing for month 
//  abbreviations: ['jan', feb, 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].
//
///////////////////////////////////////////////////////////////////////////////////


export function formattedDateToSqlTimestamp(string: string){ // string : "August 1, 2021 00:00:00"
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //  The date constructor can take non-standard date strings, and parse them.
  //  However, this is somewhat of an unsafe practice. The best approach is to
  //  Take the formatted string and parse it yourself, then convert the values
  //  to integers, and plug them into new Date() :
  //
  //    const date = new Date(year, month, day, hours, minutes, seconds);
  //
  //  Obviously, the implementation is dependendent on the particular
  //  format of the expected string argument.
  //
  ///////////////////////////////////////////////////////////////////////////////////
  
  
  let dateParts              = string.split(' ');
  dateParts                  = dateParts.filter(part => part !== ""); //Remove potential double-spaces.
  const months               = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  let month: number|string   = dateParts[0].trim();
  let day:   number|string   = dateParts[1].trim(); 
  let year:  number|string   = dateParts[2].trim();
  let time:  string          = dateParts[3];
  time                       = typeof time !== 'undefined' ? time.trim() : "00:00:00"; // Add a default time if none was specified.
  time                       = time.length === 5 ? `${time}:00` : time;                // If times is only 5 chars long assume military time shorthand, and add ':00'.
  const timeParts            = time.split(':');
  let hours:   number|string = timeParts[0];
  let minutes: number|string = timeParts[1];
  let seconds: number|string = timeParts[2];
  const allParts             = [ year, month, day, hours, minutes, seconds ];


  // Remove the expected ',' after day. Also remove possible '.' that may occur when spacing in inputs.
  const fixedParts = allParts.map(part => {
    const lastChar = part.charAt(part.length-1);
    if (lastChar === ',' || lastChar === '.'){ return part.substring(0, part.length - 1); }
    return part;
  });


  year    = fixedParts[0];
  month   = fixedParts[1];
  day     = fixedParts[2];
  hours   = fixedParts[3];
  minutes = fixedParts[4];
  seconds = fixedParts[5];


  // Convert string values to integers:
  year                       = parseInt(year,    10);
  month                      = months.indexOf(month.toLowerCase()); // Convert month to number (0-11);
  day                        = parseInt(day,     10);
  hours                      = parseInt(hours,   10);
  minutes                    = parseInt(minutes, 10);
  seconds                    = parseInt(seconds, 10);

  
  //Create new Date, convert to ISO string, then format into quasi ISO as needed for this project.
  const date                 = new Date(year, month, day, hours, minutes, seconds);
  const isoString            = date.toISOString();
  const isoParts             = isoString.split('T');
  const datePart             = isoParts[0];
  const timePart             = isoParts[1].split('.')[0];

  return `${datePart} ${timePart}`;
}



/* ========================================================================

======================================================================== */
// This function converts a date object to "YYYY-MM-DD HH:MM:SS"


export function dateObjectToSqlTimestamp(date: Date){ 
  const isoString = date.toISOString();        // => "1978-05-09T06:00:00.000Z"
  const isoParts  = isoString.split('T');      // => ["1978-05-09", "06:00:00.000Z"]
  const datePart  = isoParts[0];               // => "1978-05-09"
  const timePart  = isoParts[1].split('.')[0]; // => "06:00:00" 
  return `${datePart} ${timePart}`;
}


