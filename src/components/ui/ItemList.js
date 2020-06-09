import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom"; // a React element for linking
import { gear } from "../../data/gear";
// import Item from "../ui/Item";
// import SingleLevel from "../ui/SingleLevel"; // new single level component that only views one level at a time
import ItemCard from "../ui/ItemCard"; // new single level component that only views one level at a time
import orderBy from "lodash/orderBy";

export default class ItemList extends React.Component {
   // constructor() {
   //    super(); // boilerplate line that needs to be in the constructor

   //    // initialize state inside the constructor via this.state = {key: value, key: value,};
   //    // set default state values for each component
   //    // define a component's initial state
   //    this.state = {
   //       // isFavoritesChecked: false,
   //       allKits: orderBy(gear, "name", "asc"),
   //       // displayedFuncs: orderBy(uiData, "order", "desc"),
   //       // orderBy: '["order", "desc"]',
   //    };

   //    // this.methodName = this.methodName.bind(this) // example boilerplate to bind this for each method
   // }

   constructor() {
      super(); // boilerplate

      // set default state values for each component
      this.state = {
         isShowingPacked: false,
         isPackedOnBottom: false,
      };
   }

   // methods happen here, such as what happens when you click on a button

   // toggle show packed items
   toggleShowPacked() {
      this.setState({ isShowingPacked: !this.state.isShowingPacked });
      console.log("hi there", this.props.itemData);
   }

   // toggle put packed on bottom
   togglePackedOnBottom() {
      this.setState({ isPackedOnBottom: !this.state.isPackedOnBottom });
   }

   renderContainingItems(items, parentItemLevel) {
      // get indices for each item (used in their pages' urls)
      for (let i in items) {
         items[i].index = i;
      }
      // console.log("items with indices", items);

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

      // render each sub item
      return displayedItems.map((item) => {
         return (
            // <Item
            //    key={item.name}
            //    itemData={item}
            //    itemLevel={parentItemLevel + 1}
            // />
            <ItemCard
               key={item.name}
               itemData={item}
               itemLevel={parentItemLevel + 1}
               itemIndex={item.index}
            />
         );
      });

      // return <div className="card-body">{outputPieces}</div>;
   }

   render() {
      // get the item data
      let itemData;
      // console.log("this.props.itemData", this.props.itemData);
      if (this.props.itemData === undefined) {
         // console.log("doing undefined");
         const urlItemIndex = parseInt(this.props.match.params.handle); // gets the item index from the url
         // console.log("urlItemIndex", urlItemIndex);
         // console.log("gear.items", gear.items);
         itemData = gear.items[urlItemIndex];
      } else {
         itemData = this.props.itemData; // set itemData to the prop that was sent
      }
      console.log("itemData", itemData);

      return (
         <AppTemplate>
            <h4>{itemData.name}</h4>
            <Link to="/all-kits">Back</Link>
            <div className="row">
               <div className="col">
                  <div className="custom-control custom-switch">
                     <input
                        type="checkbox"
                        className="custom-control-input display-switch-label"
                        id={"show-packed-switch" + itemData.name}
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
                        htmlFor={"show-packed-switch" + itemData.name}
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
                           id={"packed-on-bottom-switch" + itemData.name}
                           checked={this.state.isPackedOnBottom}
                           onChange={(e) => {
                              this.togglePackedOnBottom(e);
                           }}
                        />
                        <label
                           className="custom-control-label display-switch-label"
                           htmlFor={"packed-on-bottom-switch" + itemData.name}
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
            <div className="row">
               <div className="col">
                  {/* {itemData.items.map((subItem) => {
                     return <ItemCard key={"sdfs"} itemData={subItem} />;
                  })} */}
                  {this.renderContainingItems(
                     itemData.items,
                     this.props.itemLevel
                  )}
               </div>
            </div>
         </AppTemplate>
      );
   }
}
