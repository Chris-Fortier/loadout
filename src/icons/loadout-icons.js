import React from "react";

// these are my own icons

function PackedIcon() {
   return (
      <svg viewBox="0 2 24 28">
         <path
            className="parent-item"
            d="M 6,10 V 22 H 18 V 10 l -2,2 v 8 H 8 v -8 z"
         />
         <rect className="this-item" width="6" height="6" x="9" y="13" />
         <path
            className="parent-item"
            d="M 5.9999999,7.171573 6,10 1.7573586,5.7573589 3.171572,4.3431454 Z"
         />
         <path
            className="parent-item"
            d="M 18,7.171573 V 10 L 22.242641,5.7573589 20.828428,4.3431455 Z"
         />
      </svg>
   );
}

function ReadyToPackIcon() {
   return (
      <svg viewBox="0 2 24 28">
         <path
            className="parent-item"
            d="M 6,10 V 22 H 18 V 10 l -2,2 v 8 H 8 v -8 z"
         />
         <rect className="this-item" width="6" height="6" x="9" y="2" />
         <path
            className="parent-item"
            d="M 5.9999999,7.171573 6,10 1.7573586,5.7573589 3.171572,4.3431454 Z"
         />
         <path
            className="parent-item"
            d="M 18,7.171573 V 10 L 22.242641,5.7573589 20.828428,4.3431455 Z"
         />
      </svg>
   );
}

function NotReadyToPackIcon() {
   return (
      <svg viewBox="0 4 24 24">
         <path
            className="parent-item"
            d="M 6,10 V 22 H 18 V 10 l -2,2 v 8 H 8 v -8 z"
         />
         <path
            className="parent-item"
            d="M 5.9999999,7.171573 6,10 1.7573586,5.7573589 3.171572,4.3431454 Z"
         />
         <path
            className="parent-item"
            d="M 18,7.171573 V 10 L 22.242641,5.7573589 20.828428,4.3431455 Z"
         />
      </svg>
   );
}

function ChildrenUnpackedIcon() {
   return (
      <svg viewBox="0 4 24 24">
         <path
            className="this-item"
            d="M 6,10 V 22 H 18 V 10 l -2,2 v 8 H 8 v -8 z"
         />
         <path
            className="this-item"
            d="M 5.9999999,7.171573 6,10 1.7573586,5.7573589 3.171572,4.3431454 Z"
         />
         <path
            className="this-item"
            d="M 18,7.171573 V 10 L 22.242641,5.7573589 20.828428,4.3431455 Z"
         />
         <rect className="child-item" width="4" height="4" x="9" y="15" />
         <rect className="child-item" width="4" height="4" x="10.5" y="8.5" />
         <rect className="child-item" width="4" height="4" x="13" y="2" />
      </svg>
   );
}

function ChildrenPackedIcon() {
   return (
      <svg viewBox="0 4 24 24">
         <path
            className="this-item"
            d="M 6,10 V 22 H 18 V 10 l -2,2 v 8 H 8 v -8 z"
         />
         <path
            className="this-item"
            d="M 5.9999996,10 H 18 l -2,2 H 7.9999996 Z"
         />
         <rect className="child-item" width="4" height="4" x="9" y="15" />
         <rect className="child-item" width="4" height="4" x="11" y="13" />
      </svg>
   );
}
export {
   PackedIcon,
   ReadyToPackIcon,
   NotReadyToPackIcon,
   ChildrenUnpackedIcon,
   ChildrenPackedIcon,
};
