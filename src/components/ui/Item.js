import React from "react";
import { Link } from "react-router-dom"; // a React element for linking

export default class Item extends React.Component {
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
      // extra js can go here

      const item = this.props.itemData;

      return (
         <div to="/kit-list" className="card">
            <div className="card-body">
               <div className="row">
                  <div className="col-8">{item.itemName}</div>
               </div>
            </div>
         </div>
      );
   }
}
