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
      // extra js can go here

      // const props = this.props;
      const kitData = this.props.kitData;

      // find the total number of items in this kit
      const numItems = kitData.items.length;

      // find the number of packed items by counting how many have packed set to true
      const numPackedItems = kitData.items.reduce((numPacked, item) => {
         if (item.packed) {
            return (numPacked += 1);
         } else {
            return numPacked;
         }
      }, 0);
      // console.log(
      //    "found this many packed items in",
      //    kitData.kitName,
      //    numPackedItems
      // );

      return (
         <Link to="/kit-list" className="card">
            <div className="card-body">
               <div className="row">
                  <div className="col-8">{kitData.kitName}</div>
                  <div className="col-4">
                     {numPackedItems}/{numItems} Packed
                  </div>
               </div>
            </div>
         </Link>
      );
   }
}
