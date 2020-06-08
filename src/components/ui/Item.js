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
         isExpanded: false,
         isShowingPacked: false,
         isPackedOnBottom: false,
      };
   }

   // function that can toggle any true false state property
   // toggleState(propertyName) {
   //    this.setState({ isShowingPacked: !this.state[propertyName] });
   //    console.log("toggle", propertyName, this.state[propertyName]);
   // }

   // update the presented list of this items's child items based on this item's states
   // updateDisplayedItems(e) {
   //    const displayedItems = orderBy(this.allSubItems, "name", "asc");
   //    this.setState({ displayedItems: displayedItems });
   // }

   // render the buttons and switched that appear at the top of an expanded item (including the root item which is always expanded)
   renderItemSubHeader() {
      return (
         <>
            <div className="row">
               <div className="col">
                  <div className="custom-control custom-switch">
                     <input
                        type="checkbox"
                        className="custom-control-input display-switch-label"
                        id={"show-packed-switch" + this.props.itemData.name}
                        checked={this.state.isShowingPacked}
                        onChange={(e) => {
                           this.toggleShowPacked(e);
                        }}
                        // onChange={(e) => {
                        //    this.toggleShowPacked(e);
                        // }}
                     />
                     <label
                        className="custom-control-label display-switch-label"
                        htmlFor={
                           "show-packed-switch" + this.props.itemData.name
                        }
                     >
                        Show {} Packed Items
                     </label>
                  </div>
                  {/* need to make this switch only render if we are seeing packed items */}
                  {this.state.isShowingPacked && (
                     <div className="custom-control custom-switch">
                        <input
                           type="checkbox"
                           className="custom-control-input display-switch-label"
                           id={
                              "packed-on-bottom-switch" +
                              this.props.itemData.name
                           }
                           checked={this.state.isPackedOnBottom}
                           onChange={(e) => {
                              this.togglePackedOnBottom(e);
                           }}
                        />
                        <label
                           className="custom-control-label display-switch-label"
                           htmlFor={
                              "packed-on-bottom-switch" +
                              this.props.itemData.name
                           }
                        >
                           Move Packed to Bottom
                        </label>
                     </div>
                  )}
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
   renderContainingItems(items, parentItemLevel) {
      let displayedItems = []; // initialize a new list for displayed items

      displayedItems = orderBy(items, "name", "asc"); // sort the items by name

      // sort the items by packed status if desired, with packed items on bottom
      if (this.state.isPackedOnBottom) {
         displayedItems = orderBy(displayedItems, "isPacked", "asc");
      }

      // hide packed items if desired
      if (this.state.isShowingPacked === false) {
         displayedItems = displayedItems.filter(
            (item) => item.isPacked === false
         ); // keep only the unpacked items
      }

      // assign a rotating number to each item so I can give them alternating colors
      // there are three colors used for items to ensure that two adjacent items are always a different color
      // and their parent item is a different color
      // let colorsToUse = [];
      // if (parentColorChoice === 0) {
      //    colorsToUse = [1, 2];
      // } else if (parentColorChoice === 1) {
      //    colorsToUse = [0, 2];
      // } else if (parentColorChoice === 2) {
      //    colorsToUse = [0, 1];
      // } else if (parentColorChoice === null) {
      //    colorsToUse = [0, 1, 2];
      // }
      // for (let i in displayedItems) {
      // const evenOdd = i % colorsToUse.length;
      // displayedItems[i].colorChoice = colorsToUse[evenOdd];
      // }

      // console.log("displayed items", parentColorChoice, displayedItems);

      let outputPieces = [];

      // add the controls at the top of the item
      outputPieces.push(this.renderItemSubHeader());

      // render each sub item
      outputPieces.push(
         displayedItems.map((item) => {
            return (
               <Item
                  key={item.name}
                  itemData={item}
                  itemLevel={parentItemLevel + 1}
               />
            );
         })
      );

      return <div className="card-body">{outputPieces}</div>;
   }

   // toggle the expanded state of the item
   toggleExpanded() {
      this.setState({ isExpanded: !this.state.isExpanded });
   }

   // toggle show packed items
   toggleShowPacked() {
      this.setState({ isShowingPacked: !this.state.isShowingPacked });
      console.log("hi there", this.props.itemData);
   }

   // toggle put packed on bottom
   togglePackedOnBottom() {
      this.setState({ isPackedOnBottom: !this.state.isPackedOnBottom });
   }

   render() {
      // extra js can go here

      // this is to simplify code below
      const itemData = this.props.itemData;

      // render this if this item is the root level item
      if (this.props.itemLevel === 0) {
         return (
            <>
               {this.renderContainingItems(
                  itemData.items,
                  this.props.itemLevel
               )}
            </>
         );
      }

      // render this if the item has subitems
      else if (itemData.hasOwnProperty("items")) {
         const numItems = itemData.items.length;

         // find the number of packed items by counting how many have packed set to true
         const numPackedItems = itemData.items.reduce((numPacked, item) => {
            if (item.isPacked) {
               return (numPacked += 1);
            } else {
               return numPacked;
            }
         }, 0);

         return (
            <div
               className={
                  "card text-white mt-3 item-card color" +
                  String(this.props.itemLevel % 3) // 3 is the number of color levels before it starts over
               }
            >
               <div
                  className="card-header"
                  onClick={() => this.toggleExpanded()}
               >
                  <div className="float-left">
                     <div className="custom-control custom-checkbox">
                        <input
                           className="custom-control-input"
                           type="checkbox"
                           id="packed-checkbox"
                           value="option1"
                           checked={itemData.isPacked}
                        />
                        <label
                           className="custom-control-label text-white"
                           htmlFor="packed-checkbox"
                        >
                           {itemData.name}
                        </label>
                     </div>
                  </div>
                  <div className="float-right packed-counter">
                     {numPackedItems} / {numItems}
                  </div>
                  <div className="clearfix"></div>
               </div>
               {/* <div className="card-header">
                  <div className="row">
                     <div className="col-1 red">
                        <div className="form-check form-check-inline">
                           <input
                              className="form-check-input"
                              type="checkbox"
                              id="packed-checkbox"
                              value="option1"
                              checked={itemData.packed}
                           />
                        </div>
                     </div>
                     <div className="col-8">{itemData.name}</div>
                     <div className="col-3">
                        {numPackedItems}/{numItems}
                     </div>
                  </div>
               </div> */}
               {this.state.isExpanded &&
                  this.renderContainingItems(
                     itemData.items,
                     this.props.itemLevel
                  )}
            </div>
         );
      } else {
         return (
            <div
               className={
                  "card text-white mt-3 item-card color" +
                  String(this.props.itemLevel % 3) // 3 is the number of color levels before it starts over
               }
            >
               <div className="card-header">
                  <div className="float-left">
                     <div className="custom-control custom-checkbox">
                        <input
                           className="custom-control-input"
                           type="checkbox"
                           id="packed-checkbox"
                           value="option1"
                           checked={itemData.isPacked}
                        />
                        <label
                           className="custom-control-label text-white"
                           htmlFor="packed-checkbox"
                        >
                           {itemData.name}
                        </label>
                     </div>
                  </div>
               </div>
            </div>
         );
      }
   }
}
