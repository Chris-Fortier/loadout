import React from "react";
import Header from "../ui/Header";
import { Link } from "react-router-dom"; // a React element for linking
import { gear } from "../../data/gear";
import orderBy from "lodash/orderBy";
import {
   // IconEdit,
   // IconAddCircle,
   // IconArrowThickUpCircle,
   // IconArrowThickDownCircle,
   IconArrowThinLeftCircle,
   IconArrowThinRightCircle,
   IconChevronDown,
   IconChevronUp,
} from "../../icons/icons.js";

export default class ItemList extends React.Component {
   constructor() {
      super(); // boilerplate

      // set default state values for each component

      this.state = {
         isShowingPacked: true,
         isPackedOnBottom: false,
         isEditMode: false,
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

   // toggle mode from pack to edit
   toggleEditMode() {
      this.setState({ isEditMode: !this.state.isEditMode });
   }

   // toggle show packed items
   unpackAll(itemData) {
      console.log("unpacking all");
      for (let i in itemData.items) {
         itemData.items[i].isPacked = false;
         if (itemData.items[i].hasOwnProperty("items")) {
            // unpack all this item's items and so on
            this.unpackAll(itemData.items[i]);
         }
      }
      this.forceUpdate(); // forces re-render, hacky way
   }

   // toggle show packed items
   toggleIsPacked(itemData) {
      // this.setItemNums(itemData); // make sure the number of packed items this has is up to date
      // console.log(itemData.numPackedItems);
      if (itemData.numPackedItems === itemData.numItems) {
         itemData.isPacked = !itemData.isPacked;
         this.forceUpdate(); // forces re-render, hacky way
         // console.log("itemData.isPacked", itemData.isPacked);
         // console.log("this.props", this.props);
      }
   }

   // functions related to a single item card
   deleteThisItem(itemData) {
      console.log("deleting item");
      console.log(itemData);
      // delete itemData;
      this.forceUpdate();
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

   // renders a one line card represenation of an item
   renderItemCard(itemData) {
      // console.log("render item card with this", itemData);

      let expander = null;

      let checkBoxClassSuffix = "";
      let expanderClassSuffix = "";
      // do this if this item has subitems
      if (itemData.hasOwnProperty("items")) {
         this.setItemNums(itemData); // find the number of items packed and total number of items

         // this will make the checkboxes disabled for items that don't have all their containing items packed
         if (itemData.numPackedItems < itemData.numItems) {
            checkBoxClassSuffix = " faint";
         } else {
            expanderClassSuffix = " faint";
         }

         // a used so I can make the link relative to the full path
         expander = (
            <>
               <Link
                  to={window.location.pathname + "-" + itemData.index}
                  className={"float-right packed-counter" + expanderClassSuffix}
               >
                  {itemData.numPackedItems} / {itemData.numItems}
                  <div className="icon right">
                     <IconArrowThinRightCircle />
                  </div>
               </Link>
            </>
         );
      }

      // <div>
      // <div className="float-left">x</div>
      // <div className="float-left">{itemData.name}</div>
      // <div className="float-right">12 / 12</div>
      // </div>

      return (
         <div className={"card item-card color" + String(itemData.level % 3)}>
            {/* <div className="float-left"> */}
            <div>
               <div
                  className={
                     "float-left custom-control custom-checkbox" +
                     checkBoxClassSuffix
                  }
               >
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
                  {/* for some reason if I don't have a label, the entire checkbox is not visible */}
                  <label
                     className="custom-control-label"
                     htmlFor={"packed-checkbox-" + itemData.index}
                  ></label>
               </div>
               <div className="float-left">{itemData.name}</div>
               <div className="float-right">{expander}</div>
            </div>
         </div>
      );
   }

   // renders a one line card represenation of an item
   renderItemCardEdit(itemData) {
      return (
         <div className={"card item-card color" + String(itemData.level % 3)}>
            <div>
               <div className="icon left">
                  <IconChevronDown />
               </div>
               <div className="float-left">
                  <input
                     className="edit-name"
                     id={"edit-name-input-" + itemData.name}
                     value={itemData.name}
                  />
               </div>
               <div className="icon right">
                  <IconChevronDown />
               </div>
               <div className="icon right">
                  <IconChevronUp />
               </div>
            </div>
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

      let displayedItems = []; // initialize a new list for displayed items

      // displayedItems = orderBy(items, "name", "asc"); // sort the items by name
      displayedItems = items;

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

      if (this.state.isEditMode) {
         // do edit mode version of item cards
         return displayedItems.map((item) => {
            return this.renderItemCardEdit(item);
         });
      } else {
         // do packing mode version of item cards
         return displayedItems.map((item) => {
            return this.renderItemCard(item);
         });
      }
   }

   render() {
      // get the item data
      let itemData; // initialize itemData
      let parentName = null; // initialize the name of the parent
      let itemLevel = 0; // initialize the value that stores how many levels deep this page's item's level is

      // get the item based on the url index path (e.g. 3/2/4 would be item index 4 of item index 2 inside item index 3)
      const itemIndexPath = this.props.match.params.handle.split("-"); // represents the path to the item in a list of index numbers
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
         pageContentClasses =
            "card super-item-card color" + String(itemLevel % 3);
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
                              className="up-level"
                              to={window.location.pathname.substring(
                                 0,
                                 window.location.pathname.lastIndexOf("-")
                              )}
                           >
                              <span className="icon left">
                                 <IconArrowThinLeftCircle />
                              </span>
                              Back to {parentName}
                           </Link>
                        )}
                        {/* <img src={iconEdit} className="icon" /> */}
                        <div className={pageContentClasses}>
                           <div className={levelHeaderClasses}>
                              <div className="row">
                                 <div className="col">
                                    <h4>{itemData.name}</h4>
                                 </div>
                                 {this.state.isEditMode === false && (
                                    <div className="col">
                                       <h4 className="float-right packed-counter">
                                          {itemData.numPackedItems} /{" "}
                                          {itemData.numItems}
                                       </h4>
                                    </div>
                                 )}
                              </div>
                              {this.state.isEditMode === false && (
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
                                             checked={
                                                this.state.isShowingPacked
                                             }
                                             onChange={(e) => {
                                                this.toggleShowPacked(e);
                                             }}
                                          />
                                          <label
                                             className="custom-control-label display-switch-label"
                                             htmlFor={
                                                "show-packed-switch" +
                                                itemData.name
                                             }
                                          >
                                             Show {itemData.numPackedItems}{" "}
                                             Packed Item(s)
                                          </label>
                                       </div>
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
                              )}

                              <div className="row">
                                 <div className="col">
                                    <button
                                       className="btn action-button"
                                       onClick={(e) => {
                                          this.toggleEditMode(itemData);
                                       }}
                                    >
                                       Edit Mode Toggle
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
