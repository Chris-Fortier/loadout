import React from "react";
import { Link } from "react-router-dom"; // a React element for linking

export default function Navigation() {
   const url = window.location.pathname;

   const tabActiveOnCreate = (url) => {
      // test if we are on the create tab, if so return the tab-active class
      if (
         url.indexOf("create-imagery") > 0 ||
         url.indexOf("create-answer") > 0
      ) {
         return "tab-active";
      } else return "";
   };

   const tabActiveOnReview = (url) => {
      // test if we are on the review tab, if so return the tab-active class
      if (
         url.indexOf("review-imagery") > 0 ||
         url.indexOf("review-answer") > 0 ||
         url.indexOf("review-empty") > 0
      ) {
         return "tab-active";
      } else return "";
   };

   const tabActiveOnAllCards = (url) => {
      // test if we are on the all cards tab, if so return the tab-active class
      if (url.indexOf("all-cards") > 0) {
         return "tab-active";
      } else return "";
   };

   return (
      <div
         className="btn-group d-flex mb-5"
         role="navigation"
         aria-label="navigation"
      >
         <Link
            to="/create-answer"
            type="button"
            className={`btn btn-secondary btn-navigation ${tabActiveOnCreate(
               url
            )}`}
         >
            Create new
         </Link>
         <Link
            to="/review-imagery"
            type="button"
            className={`btn btn-secondary btn-navigation tab-separator ${tabActiveOnReview(
               url
            )}`}
         >
            Review
         </Link>
         <Link
            to="/all-cards"
            type="button"
            className={`btn btn-secondary btn-navigation tab-separator ${tabActiveOnAllCards(
               url
            )}`}
         >
            All cards
         </Link>
      </div>
   );
}
