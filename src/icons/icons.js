import React from "react";

function IconEdit() {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         className="icon-edit"
      >
         <path
            className="primary"
            d="M4 14a1 1 0 0 1 .3-.7l11-11a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4l-11 11a1 1 0 0 1-.7.3H5a1 1 0 0 1-1-1v-3z"
         />
         <rect
            width="20"
            height="2"
            x="2"
            y="20"
            className="secondary"
            rx="1"
         />
      </svg>
   );
}

function IconAddCircle() {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         className="icon-add-circle"
      >
         <circle cx="12" cy="12" r="10" className="primary" />
         <path
            className="secondary"
            d="M13 11h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4z"
         />
      </svg>
   );
}

function IconArrowThickDownCircle() {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         class="icon-arrow-thick-down-circle"
      >
         <circle cx="12" cy="12" r="10" class="primary" />
         <path
            class="secondary"
            d="M10 12V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h2a1 1 0 0 1 .7 1.7l-4 4a1 1 0 0 1-1.4 0l-4-4A1 1 0 0 1 8 12h2z"
         />
      </svg>
   );
}

function IconArrowThickUpCircle() {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         class="icon-arrow-thick-up-circle"
      >
         <circle cx="12" cy="12" r="10" class="primary" />
         <path
            class="secondary"
            d="M14 12v5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-5H8a1 1 0 0 1-.7-1.7l4-4a1 1 0 0 1 1.4 0l4 4A1 1 0 0 1 16 12h-2z"
         />
      </svg>
   );
}

function IconArrowThinLeftCircle() {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         className="icon-arrow-thin-left-circle"
      >
         <circle cx="12" cy="12" r="10" className="primary" />
         <path
            className="secondary"
            d="M9.41 11H17a1 1 0 0 1 0 2H9.41l2.3 2.3a1 1 0 1 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.42 1.4L9.4 11z"
         />
      </svg>
   );
}

function IconArrowThinRightCircle() {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         className="icon-arrow-thin-right-circle"
      >
         <circle cx="12" cy="12" r="10" className="primary" />
         <path
            className="secondary"
            d="M14.59 13H7a1 1 0 0 1 0-2h7.59l-2.3-2.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4l2.3-2.3z"
         />
      </svg>
   );
}

export {
   IconEdit,
   IconAddCircle,
   IconArrowThickDownCircle,
   IconArrowThickUpCircle,
   IconArrowThinLeftCircle,
   IconArrowThinRightCircle,
};
