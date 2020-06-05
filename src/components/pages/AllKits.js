import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom"; // a React element for linking

export default function AllKits() {
   return (
      <AppTemplate>
         <h4>My Kits</h4>
         {/* <Link to="/kit-list">Camera Bag</Link>
         <Link to="/kit-list">Day Pack</Link>
         <Link to="/kit-list">Car Kit</Link> */}

         <Link to="/kit-list" className="card red">
            <div className="card-body green">
               <div className="row blue">
                  <div className="col-8 blue">Camera Bag</div>
                  <div className="col-4 cyan">5/10</div>
               </div>
            </div>
         </Link>

         <Link to="/kit-list" className="card red">
            <div className="card-body green">
               <div className="row blue">
                  <div className="col-8 blue">Day Pack</div>
                  <div className="col-4 cyan">24/33</div>
               </div>
            </div>
         </Link>
      </AppTemplate>
   );
}
