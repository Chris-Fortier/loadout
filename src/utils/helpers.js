// file of small application-wide helpers

const safelyParseJSON = (str) => {
   // this will prevent JSON parse from getting a syntax error and crashing your program
   try {
      JSON.parse(str);
   } catch (e) {
      return str;
   }
   return JSON.parse(str);
};

const isObject = (value) => {
   // this will check wheter or not this value is an object
   // returns true if the value is an object and is not null and is not an array
   return (
      typeof value === "object" &&
      value !== null &&
      Array.isArray(value) === false
   );
};

const convertDataType = (str) => {
   // takes a string and interprets it into a different data type

   if (str === "undefined") return undefined;
   return safelyParseJSON(str);

   // one-lining these makes it easier to read in this case
   // if (str === "null") return null;
   // if (str === "undefined") return undefined;
   // if (str.toLowerCase() === "true") return true;
   // if (str.toLowerCase() === "false") return false;
   // // eslint-disable-next-line
   // if (str == Number(str)) return Number(str);
   // const parsedJSON = safelyParseJSON(str);
   // if (Array.isArray(parsedJSON)) return parsedJSON;
   // if (isObject(parsedJSON)) return parsedJSON; // I think isObject(str) needs to be isObject(safelyParseJSON(str))
   // return str;
};

const toKebabCase = (str) => {
   // converts a string to kebab-case
   console.log("str", str);
   const lowerCase = str.toLowerCase();
   console.log("lowerCase", lowerCase);
   const splitArray = lowerCase.split(" ");
   console.log("splitArray", splitArray);
   return splitArray.join("-");
};

function checkIsOver(num, limit) {
   return num > limit;
}

// eslint-disable-next-line
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// app master preferences
const LEVEL_COLORS = 5; // the amount of level colors there are
const MAX_ITEM_NAME_LENGTH = 30; // the maximum length of characters for an item name
const MOVE_UPDOWN = false; // whether or not to have up and down buttons in edit mode

export {
   isObject,
   convertDataType,
   safelyParseJSON,
   toKebabCase,
   checkIsOver,
   EMAIL_REGEX,
   LEVEL_COLORS,
   MAX_ITEM_NAME_LENGTH,
   MOVE_UPDOWN,
};
