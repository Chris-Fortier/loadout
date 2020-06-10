import React from "react";
// import AppTemplate from "../ui/AppTemplate";
import Header from "../ui/Header";
import { Link } from "react-router-dom"; // a React element for linking
import { gear } from "../../data/gear";
// import Item from "../ui/Item";
// import SingleLevel from "../ui/SingleLevel"; // new single level component that only views one level at a time
// import ItemCard from "../ui/ItemCard"; // new single level component that only views one level at a time
import orderBy from "lodash/orderBy";

export default class ItemList extends React.Component {
   constructor() {
      super(); // boilerplate

      // set default state values for each component

      // console.log("props", props);

      this.state = {
         isShowingPacked: false,
         isPackedOnBottom: false,
         // isPackeds: this.props.itemData.items.map((subitem) => {
         //    subitem.isPacked;
         // }), // make an array of the packed status of each subitem
         subItems: [], // an array to store a copy of the items from data
      };
   }

   // methods happen here, such as what happens when you click on a button

   // toggle show packed items
   toggleShowPacked() {
      this.setState({ isShowingPacked: !this.state.isShowingPacked });
   }

   // toggle put packed on bottom
   togglePackedOnBottom() {
      this.setState({ isPackedOnBottom: !this.state.isPackedOnBottom });
   }

   // toggle show packed items
   unpackAll(itemData) {
      console.log("unpacking all");
      for (let i in itemData.items) {
         itemData.items[i].isPacked = false;
         this.forceUpdate();
      }
   }

   // toggle show packed items
   toggleIsPacked(itemData) {
      // this.setState({ isPacked: !this.state.isPacked });
      // console.log("e", e);
      // console.log(this.props.itemData);
      // itemData.isPacked = !itemData.isPacked;

      itemData.isPacked = !itemData.isPacked;
      this.forceUpdate(); // forces re-render, hacky way
      console.log("itemData.isPacked", itemData.isPacked);
      console.log("this.props", this.props);

      // newIsPackeds = this.state.isPacked
      // this.setState({isPackeds})
   }

   // this sets the packed number of items and the total number of items
   setItemNums(itemData) {
      itemData.numItems = itemData.items.length;

      // find the number of packed items by counting how many have packed set to true
      itemData.numPackedItems = itemData.items.reduce((numPacked, item) => {
         if (item.isPacked) {
            return (numPacked += 1);
         } else {
            return numPacked;
         }
      }, 0);
   }

   renderItemCard(itemData) {
      // this is to simplify code below
      // const itemData = this.props.itemData;

      console.log("render item card with this", itemData);

      let expander = null;

      // do this if this item has subitems
      if (itemData.hasOwnProperty("items")) {
         this.setItemNums(itemData); // find the number of items packed and total number of items

         // console.log("hello", toKebabCase(itemData.name));

         // a used so I can make the link relative to the full path
         expander = (
            <Link
               to={window.location.pathname + "-" + itemData.index}
               className="float-right packed-counter"
            >
               {itemData.numPackedItems} / {itemData.numItems} >>
            </Link>
         );
      }

      return (
         <div className={"card item-card color" + String(itemData.level % 3)}>
            {/* <div className="card-header"> */}
            <div className="float-left">
               <div className="custom-control custom-checkbox">
                  <input
                     className="custom-control-input"
                     type="checkbox"
                     id={"packed-checkbox-" + itemData.index}
                     value="option1"
                     checked={itemData.isPacked}
                     onChange={(e) => {
                        this.toggleIsPacked(itemData);
                     }}
                  />
                  <label
                     className="custom-control-label"
                     htmlFor={"packed-checkbox-" + itemData.index}
                  >
                     {itemData.name}
                  </label>
                  {expander}
               </div>
            </div>
            {/* </div> */}
         </div>
      );
   }

   renderContainingItems(itemData) {
      const items = itemData.items; // to simplify code below

      // get indices and levels for each item
      for (let i in items) {
         items[i].index = i; // set an index (used in their pages' urls)
         items[i].level = itemData.level + 1; // set the level to each child item to this level plus one
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
            // <ItemCard
            //    key={item.name}
            //    itemData={item}
            //    itemLevel={parentItemLevel + 1}
            //    itemIndex={item.index}
            //    parentName={item.name}
            // />
            this.renderItemCard(item)
         );
      });

      // return <div className="card-body">{outputPieces}</div>;
   }

   render() {
      // get the item data
      let itemData; // initialize itemData
      let parentName = null; // initialize the name of the parent
      let itemLevel = 0; // initialize the value that stores how many levels deep this page's item's level is
      // console.log("render");

      // if itemData was not passed to this
      // if (this.props.itemData === undefined) {
      // get the item based on the url index path (e.g. 3/2/4 would be item index 4 of item index 2 inside item index 3)

      const itemIndexPath = this.props.match.params.handle.split("-"); // represents the path to the item in a list of index numbers
      // console.log("itemIndexPath", itemIndexPath);
      itemData = gear;
      for (let levelIndex in itemIndexPath) {
         if (itemIndexPath[levelIndex] !== "") {
            parentName = itemData.name;
            itemData = itemData.items[parseInt(itemIndexPath[levelIndex])];
            itemLevel++;
         }
      }

      // place values into the itemData
      itemData.parentName = parentName;
      itemData.level = itemLevel;

      // const urlItemIndex = parseInt(this.props.match.params.handle); // gets the item index from the url
      // itemData = gear.items[urlItemIndex];
      // } else {
      //    itemData = this.props.itemData; // set itemData to the prop that was sent
      // }
      // console.log("itemData", itemData);

      console.log("itemLevel", itemLevel);

      this.setItemNums(itemData); // count number of packed and total items inside this

      // these are classes that are different if we are at the top level or a lower level
      let pageBgClasses = "";
      let pageContentClasses = "";
      let levelHeaderClasses = "";
      let levelBodyClasses = "";
      if (itemData.level === 0) {
         pageBgClasses = "item-list color" + String(itemLevel % 3);
      } else {
         pageBgClasses = "item-list color" + String((itemLevel - 1) % 3);
         pageContentClasses = "card color" + String(itemLevel % 3);
         levelHeaderClasses = "card-header";
         levelBodyClasses = "card-body";
      }

      return (
         <>
            <Header />
            <div className={pageBgClasses}>
               <div className="container">
                  <div className="row">
                     <div className="col-12 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">
                        {parentName !== null && (
                           <Link
                              to={window.location.pathname.substring(
                                 0,
                                 window.location.pathname.lastIndexOf("-")
                              )}
                           >
                              &lt;&lt; Back to {parentName}
                           </Link>
                        )}
                        <div className={pageContentClasses}>
                           <div className={levelHeaderClasses}>
                              <div className="row">
                                 <div className="col">
                                    <h4>{itemData.name}</h4>
                                 </div>
                                 <div className="col">
                                    <h4 className="float-right d-inline">
                                       {itemData.numPackedItems} /{" "}
                                       {itemData.numItems}
                                    </h4>
                                 </div>
                              </div>
                              {/* {this.props.hasOwnProperty("parentName") && this.props.parentName} */}
                              <div className="row">
                                 <div className="col">
                                    <div className="custom-control custom-switch">
                                       <input
                                          type="checkbox"
                                          className="custom-control-input display-switch-label"
                                          id={
                                             "show-packed-switch" +
                                             itemData.name
                                          }
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
                                             "show-packed-switch" +
                                             itemData.name
                                          }
                                       >
                                          Show {itemData.numPackedItems} Packed
                                          Item(s)
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
                                                itemData.name
                                             }
                                             checked={
                                                this.state.isPackedOnBottom
                                             }
                                             onChange={(e) => {
                                                this.togglePackedOnBottom(e);
                                             }}
                                          />
                                          <label
                                             className="custom-control-label display-switch-label"
                                             htmlFor={
                                                "packed-on-bottom-switch" +
                                                itemData.name
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
                                    <button
                                       className="btn action-button"
                                       onClick={(e) => {
                                          this.unpackAll(itemData);
                                       }}
                                    >
                                       Unpack All
                                    </button>
                                 </div>
                              </div>
                           </div>
                           <div className={levelBodyClasses}>
                              <div className="row">
                                 <div className="col">
                                    {this.renderContainingItems(itemData)}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </>
      );
   }
}
