import React from "react";
// import utils from "../utils/utils";
// import { convertDataType } from "../utils/helpers";
// import { Link } from "react-router-dom"; // a React element for linking
import orderBy from "lodash/orderBy";

export default class Item extends React.Component {
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

   // update the presented list of this items's child items based on this item's states
   updatePresentedItems(e) {
      const displayedItems = orderBy(this.allSubItems, "name", "asc");
      this.setState({ displayedItems: displayedItems });
   }

   // renders a component for every child item for a item (give it the item object as itemData)
   renderContainingItems(itemData) {
      // console.log("amount of items", itemData.items.length);

      var displayedItems = []; // initialize a new list for displayed items

      displayedItems = orderBy(itemData.items, "name", "asc"); // sort the items by name

      // sort the items by packed status if desired, with packed items on bottom
      if (this.state.putPackedOnBottom) {
         displayedItems = orderBy(displayedItems, "packed", "asc");
      }

      // hide packed items if desired
      // console.log("showPackedItems", this.state.showPackedItems);
      if (this.state.showPackedItems === false) {
         // console.log("hiding packed items in", itemData.name);
         displayedItems = displayedItems.filter(
            (item) => item.packed === false
         ); // keep only the unpacked items
      }

      // assign a rotating number to each item so I can give them alternating colors
      for (let i in displayedItems) {
         displayedItems[i].colorChoice = i % 2;
      }

      let output = [];

      // add the controls at the top of the item
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

      // render each sub item
      output.push(
         // <div className="card text-white bg-secondary mb-3">
         //    <div className="card-header">
         //       {displayedItems[i].name} Packed =
         //       {String(displayedItems[i].packed)}
         //    </div>
         // </div>

         displayedItems.map((item) => {
            console.log("adding this item", item.name);
            return <Item key={item.name} itemData={item} />;
         })
      );

      return <div className="card-body">{output}</div>;
   }

   // toggle the expanded state of the item
   toggleExpanded() {
      // this.state.expanded = !this.state.expanded;
      this.setState({ expanded: !this.state.expanded });
      // console.log("toggling to", this.state.expanded);
   }

   render() {
      // extra js can go here

      // const props = this.props;
      const itemData = this.props.itemData;

      let colorChoice = 2;

      if (itemData.hasOwnProperty("colorChoice")) {
         console.log(itemData.colorChoice);
         colorChoice = itemData.colorChoice;
      }

      // find the total number of items in this item
      if (itemData.hasOwnProperty("items")) {
         const numItems = itemData.items.length;

         // find the number of packed items by counting how many have packed set to true
         const numPackedItems = itemData.items.reduce((numPacked, item) => {
            if (item.packed) {
               return (numPacked += 1);
            } else {
               return numPacked;
            }
         }, 0);
         // console.log(
         //    "found this many packed items in",
         //    itemData.name,
         //    numPackedItems
         // );

         return (
            <div className={"card text-white mb-3 color" + String(colorChoice)}>
               <div
                  className="card-header"
                  onClick={() => this.toggleExpanded()}
               >
                  <div className="float-left">
                     <div className="form-check form-check-inline">
                        <input
                           className="form-check-input"
                           type="checkbox"
                           id="packed-checkbox"
                           value="option1"
                           checked={itemData.packed}
                        />
                     </div>
                     {itemData.name}
                  </div>
                  <div className="float-right">
                     {numPackedItems}/{numItems}
                  </div>
                  <div className="clearfix"></div>
               </div>
               {/* <div className="card-body"> */}
               {this.state.expanded && this.renderContainingItems(itemData)}
               {/* </div> */}
            </div>
         );
      } else {
         return (
            <div className={"card text-white mb-3 color" + String(colorChoice)}>
               <div className="card-header">
                  <div className="form-check form-check-inline">
                     <input
                        className="form-check-input"
                        type="checkbox"
                        id="packed-checkbox"
                        value="option1"
                        checked={itemData.packed}
                     />
                  </div>
                  {itemData.name}
               </div>
            </div>
         );
      }
   }
}
