import React from "react";
// import appLogo from "../../icons/logo-app.svg";
import { Link } from "react-router-dom"; // a React element for linking

export default function Header() {
   return (
      <div className="row">
         <div className="col">
            <Link to="/" className="btn btn-link ml-1">
               Loadout
            </Link>
            <Link to="/" className="btn btn-link float-right">
               Account
            </Link>
         </div>
      </div>
   );
}
