import React from "react";
// import utils from "../utils/utils";
// import { convertDataType } from "../utils/helpers";
// import { Link } from "react-router-dom"; // a React element for linking
import orderBy from "lodash/orderBy";

export default class Kit extends React.Component {
   // the thing that happens first before anything else in the class happens
   constructor() {
      super(); // boilerplate

      // set default state values for each component
      this.state = {
         expanded: false,
         showPackedItems: true,
         putPackedOnBottom: true,
         // allSubItems: this.items,
         // displayedItems: this.items,
      };
   }

   // function that can toggle any true false state property
   // toggleState(propertyName) {
   //    this.setState({ showPackedItems: !this.state[propertyName] });
   //    console.log("toggle", propertyName, this.state[propertyName]);
   // }

   // update the presented list of this kit's items based on this kit's states
   updatePresentedItems(e) {
      const displayedItems = orderBy(this.allSubItems, "name", "asc");
      this.setState({ displayedItems: displayedItems });
   }

   // renders a component for every item for a kit (give it the kit object as kitData)
   renderContainingItems(kitData) {
      console.log("amount of items", kitData.items.length);

      var displayedItems = []; // initialize a new list for displayed items

      displayedItems = orderBy(kitData.items, "name", "asc"); // sort the items by name

      // sort the items by packed status if desired, with packed items on bottom
      if (this.state.putPackedOnBottom) {
         displayedItems = orderBy(displayedItems, "packed", "asc");
      }

      // hide packed items if desired
      console.log("showPackedItems", this.state.showPackedItems);
      if (this.state.showPackedItems === false) {
         console.log("hiding packed items in", kitData.name);
         displayedItems = displayedItems.filter(
            (item) => item.packed === false
         ); // keep only the unpacked items
      }

      let output = [];

      // add the controls at the top of the kit
      output.push(
         <div className="custom-control custom-switch">
            <input
               type="checkbox"
               className="custom-control-input"
               id="show-packed-switch"
               checked={this.state.showPackedItems}
            />
            <label
               className="custom-control-label"
               htmlFor="show-packed-switch"
            >
               Show Packed Items
            </label>
         </div>
      );
      if (this.state.showPackedItems) {
         output.push(
            <div className="custom-control custom-switch">
               <input
                  type="checkbox"
                  className="custom-control-input"
                  id="packed-on-bottom-switch"
                  checked={this.state.putPackedOnBottom}
               />
               <label
                  className="custom-control-label"
                  htmlFor="packed-on-bottom-switch"
               >
                  Move Packed to Bottom of List
               </label>
            </div>
         );
      }
      for (let i in displayedItems) {
         output.push(
            <div className="col-12">
               <div className="card">
                  <div className="card-body">
                     {displayedItems[i].name} Packed =
                     {String(displayedItems[i].packed)}
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
      //    kitData.name,
      //    numPackedItems
      // );

      return (
         <div>
            <div className="card">
               <div className="card-body">
                  <div className="row">
                     <div
                        className="col-8 btn btn-link"
                        onClick={() => this.toggleExpanded()}
                     >
                        {kitData.name}
                     </div>
                     <div className="col-4">
                        {numPackedItems}/{numItems} Packed
                     </div>
                     {this.state.expanded &&
                        this.renderContainingItems(kitData)}
                  </div>
               </div>
            </div>
         </div>
      );
   }
}
