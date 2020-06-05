import React from "react";
// import utils from "../utils/utils";
// import { convertDataType } from "../utils/helpers";
import { Link } from "react-router-dom"; // a React element for linking

export default class Kit extends React.Component {
   // the thing that happens first before anything else in the class happens
   // constructor() {
   //    super(); // boilerplate

   //    // set default state values for each component
   //    // this.state = {
   //    //    isResultDisplayed: false,
   //    //    isCodeDisplayed: false,
   //    //    result: "",
   //    // };
   // }

   render() {
      // extra js and functions can go here

      return (
         <Link to="/kit-list" className="card red">
            <div className="card-body green">
               <div className="row blue">
                  <div className="col-8 blue">Camera Bag</div>
                  <div className="col-4 cyan">5/10</div>
               </div>
            </div>
         </Link>
      );
   }
}
