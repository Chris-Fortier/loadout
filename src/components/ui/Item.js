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

   // render the buttons and switched that appear at the top of an expanded item (including the root item which is always expanded)
   renderItemSubHeader() {
      return (
         <>
            <div className="row">
               <div className="col">
                  <div className="custom-control custom-switch">
                     <input
                        type="checkbox"
                        className="custom-control-input"
                        id={"show-packed-switch" + this.props.itemData.name}
                        checked={this.state.showPackedItems}
                        onChange={(e) => {
                           this.toggleShowPacked(e);
                        }}
                        // onChange={(e) => {
                        //    this.toggleShowPacked(e);
                        // }}
                     />
                     <label
                        className="custom-control-label"
                        htmlFor={
                           "show-packed-switch" + this.props.itemData.name
                        }
                     >
                        Show Packed Items
                     </label>
                  </div>
                  {/* need to make this switch only render if we are seeing packed items */}
                  <div className="custom-control custom-switch">
                     <input
                        type="checkbox"
                        className="custom-control-input"
                        id={
                           "packed-on-bottom-switch" + this.props.itemData.name
                        }
                        checked={this.state.putPackedOnBottom}
                        onChange={(e) => {
                           this.togglePackedOnBottom(e);
                        }}
                     />
                     <label
                        className="custom-control-label"
                        htmlFor={
                           "packed-on-bottom-switch" + this.props.itemData.name
                        }
                     >
                        Move Packed to Bottom
                     </label>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="col">
                  <button className="btn">Unpack All</button>
               </div>
            </div>
         </>
      );
   }

   // renders a component for every child item for a item (give it the item object as itemData)
   renderContainingItems(items, parentColorChoice = null) {
      var displayedItems = []; // initialize a new list for displayed items

      displayedItems = orderBy(items, "name", "asc"); // sort the items by name

      // sort the items by packed status if desired, with packed items on bottom
      if (this.state.putPackedOnBottom) {
         displayedItems = orderBy(displayedItems, "packed", "asc");
      }

      // hide packed items if desired
      if (this.state.showPackedItems === false) {
         displayedItems = displayedItems.filter(
            (item) => item.packed === false
         ); // keep only the unpacked items
      }

      // assign a rotating number to each item so I can give them alternating colors
      // there are three colors used for items to ensure that two adjacent items are always a different color
      // and their parent item is a different color
      let colorsToUse = [];
      if (parentColorChoice === 0) {
         colorsToUse = [1, 2];
      } else if (parentColorChoice === 1) {
         colorsToUse = [0, 2];
      } else if (parentColorChoice === 2) {
         colorsToUse = [0, 1];
      } else if (parentColorChoice === null) {
         colorsToUse = [0, 1, 2];
      }
      for (let i in displayedItems) {
         let evenOdd = i % colorsToUse.length;
         displayedItems[i].colorChoice = colorsToUse[evenOdd];
      }

      console.log("displayed items", parentColorChoice, displayedItems);

      let output = [];

      // add the controls at the top of the item
      output.push(this.renderItemSubHeader());

      // render each sub item
      output.push(
         displayedItems.map((item) => {
            return <Item key={item.name} itemData={item} />;
         })
      );

      console.log("hello");
      return <div className="card-body">{output}</div>;
   }

   // toggle the expanded state of the item
   toggleExpanded() {
      this.setState({ expanded: !this.state.expanded });
   }

   // toggle show packed items
   toggleShowPacked() {
      this.setState({ showPackedItems: !this.state.showPackedItems });
      console.log("hi there", this.props.itemData);
   }

   // toggle put packed on bottom
   togglePackedOnBottom() {
      this.setState({ putPackedOnBottom: !this.state.putPackedOnBottom });
   }

   render() {
      // extra js can go here

      // this is to simplify code below
      const itemData = this.props.itemData;

      // if (this.props.hasOwnProperty("rootLevel")) {
      //    console.log("root level");
      //    return this.renderContainingItems(itemData.items);
      // }

      // get the color choice
      // if (itemData.hasOwnProperty("colorChoice") === false) {
      //    itemData.colorChoice = 2;
      // }

      // render this if this item is the root level item
      if (this.props.hasOwnProperty("rootLevel")) {
         return (
            <>
               {this.renderContainingItems(
                  itemData.items,
                  itemData.colorChoice
               )}
            </>
         );
      }

      // render this if the item has subitems
      else if (itemData.hasOwnProperty("items")) {
         const numItems = itemData.items.length;

         // find the number of packed items by counting how many have packed set to true
         const numPackedItems = itemData.items.reduce((numPacked, item) => {
            if (item.packed) {
               return (numPacked += 1);
            } else {
               return numPacked;
            }
         }, 0);

         return (
            <div
               className={
                  "card text-white mt-3 color" + String(itemData.colorChoice)
               }
            >
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
               {/* <div className="card-header">
                  <div className="row">
                     <div className="col-2">cb</div>
                     <div className="col-8 border-left">item name</div>
                     <div className="col-2">00/00</div>
                  </div>
               </div> */}
               {this.state.expanded &&
                  this.renderContainingItems(
                     itemData.items,
                     itemData.colorChoice
                  )}
            </div>
         );
      } else {
         return (
            <div
               className={
                  "card text-white mt-3 color" + String(itemData.colorChoice)
               }
            >
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
