import React from "react";
// import utils from "../utils/utils";
// import { convertDataType } from "../utils/helpers";
// import { Link } from "react-router-dom"; // a React element for linking

export default class Kit extends React.Component {
   // the thing that happens first before anything else in the class happens
   constructor() {
      super(); // boilerplate

      // set default state values for each component
      this.state = {
         expanded: false,
      };
   }

   // renders a component for every item for a kit (give it the kit object as kitData)
   renderContainingItems(kitData) {
      console.log("amount of items", kitData.items.length);
      let output = [];
      for (let i in kitData.items) {
         output.push(
            <div className="col-12">
               <div className="card">
                  <div className="card-body">
                     {kitData.items[i].itemName} Packed =
                     {String(kitData.items[i].packed)}
                  </div>
               </div>
            </div>
         );
      }
      return output;
   }

   // toggle the expanded state of the kit
   toggleExpanded() {
      // this.state.expanded = !this.state.expanded;
      this.setState({ expanded: !this.state.expanded });
      console.log("toggling to", this.state.expanded);
   }

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
         <div className="card">
            <div className="card-body">
               <div className="row">
                  <div
                     className="col-8 btn btn-link"
                     onClick={() => this.toggleExpanded()}
                  >
                     {kitData.kitName}
                  </div>
                  <div className="col-4">
                     {numPackedItems}/{numItems} Packed
                  </div>
                  {this.state.expanded && this.renderContainingItems(kitData)}
               </div>
            </div>
         </div>
      );
   }
}
