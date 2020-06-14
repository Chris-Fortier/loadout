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
   // IconArchive,
   IconArrowThinLeftCircle,
   IconArrowThinRightCircle,
   IconClose,
   IconChevronDown,
   IconChevronUp,
} from "../../icons/icons.js";
import { MOVE_UPDOWN } from "../../utils/helpers";

export default class ItemList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // get the item data
      // let itemData; // initialize itemData
      let parentName = null; // initialize the name of the parent
      let itemLevel = 0; // initialize the value that stores how many levels deep this page's item's level is
      let itemData = gear;

      // get the item based on the url index path (e.g. 3/2/4 would be item index 4 of item index 2 inside item index 3)
      // const itemIndexPath = this.props.match.params.handle.split("-"); // represents the path to the item in a list of index numbers
      const itemIndexPath = []; // represents the path to the item in a list of index numbers
      console.log("itemIndexPath", itemIndexPath);
      for (let levelIndex in itemIndexPath) {
         parentName = itemData.name;
         itemData = itemData.items[itemIndexPath[levelIndex]];
         itemLevel++;
      }

      // place values into the itemData
      // itemData.parentName = parentName;
      // itemData.level = itemLevel;

      // set default state values for each component

      this.state = {
         isShowingPacked: true,
         isPackedOnBottom: true,
         isEditMode: false,

         itemData: itemData, // stores the item data of the item represented by this page
         parentName: parentName,
         level: itemLevel,
         itemIndexPath: itemIndexPath,
      };
   }

   // methods happen here, such as what happens when you click on a button

   // move page to a different item
   movePageToDifferentItem(itemIndexPath) {
      let parentName = null; // initialize the name of the parent
      let itemLevel = 0; // initialize the value that stores how many levels deep this page's item's level is
      let itemData = gear;
      for (let levelIndex in itemIndexPath) {
         parentName = itemData.name;
         itemData = itemData.items[parseInt(itemIndexPath[levelIndex])];
         itemLevel++;
      }

      this.setState({
         itemData: itemData,
         parentName: parentName,
         level: itemLevel,
         itemIndexPath: itemIndexPath,
      });
   }

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
      console.log("unpacking", itemData.name);
      for (let i in itemData.items) {
         itemData.items[i].isPacked = false;
         if (itemData.items[i].hasOwnProperty("items")) {
            // unpack all this item's items and so on
            this.unpackAll(itemData.items[i]);
         }
      }
      this.setState({ itemData: itemData });
      // this.forceUpdate(); // forces re-render, hacky way
   }

   // toggle show packed items
   toggleIsPacked(itemIndex) {
      // this.setItemNums(itemData); // make sure the number of packed items this has is up to date
      // console.log(itemData.numPackedItems);
      if (
         this.state.itemData.items[itemIndex].numPackedItems ===
         this.state.itemData.items[itemIndex].numItems
      ) {
         // itemData.isPacked = !itemData.isPacked;
         // this.forceUpdate(); // forces re-render, hacky way
         // console.log("itemData.isPacked", itemData.isPacked);
         // console.log("this.props", this.props);
         let itemData = this.state.itemData;
         itemData.items[itemIndex].isPacked = !itemData.items[itemIndex]
            .isPacked;
         this.setState({ itemData: itemData });
      }
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

   // linkTo(itemIndex) {
   //    this.props.history.push(window.location.pathname + "-" + itemIndex);
   // }

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
                  // to={window.location.pathname + "-" + itemData.index}
                  onClick={(e) => {
                     this.movePageToDifferentItem(
                        this.state.itemIndexPath.concat([itemData.index])
                     ); // move to current path with the subitem index added on
                  }}
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

      return (
         <div
            className={
               "card item-card color" + String((this.state.level + 1) % 3)
            }
         >
            {/* <div className="float-left"> */}
            <div className="d-flex">
               <div
                  className={
                     "float-left custom-control custom-checkbox icon-container" +
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
                        this.toggleIsPacked(itemData.index);
                     }}
                  />
                  {/* for some reason if I don't have a label, the entire checkbox is not visible */}
                  <label
                     className="custom-control-label"
                     htmlFor={"packed-checkbox-" + itemData.index}
                  ></label>
               </div>
               <div className="flex-fill">{itemData.name}</div>
               <div className="flex-fill">{expander}</div>
            </div>
         </div>
      );
   }

   // updates the displayed name field of the item based on user input
   setItemName(e) {
      const splitId = e.target.id.split("-");
      const indexToSet = parseInt(splitId[splitId.length - 1]);
      let itemDataCopy = this.state.itemData; // copy itemsData from state to local
      itemDataCopy.items[indexToSet].name = e.target.value; // change the desired item's name to match input
      // this.setState({ itemData: itemDataCopy }); // seems like it works even without this line
   }

   // deletes an item
   deleteItem(e) {
      console.log("deleting an item");
      console.log("e.target.id", e.target.id);
      const splitId = e.target.id.split("-");
      const indexToSet = parseInt(splitId[splitId.length - 1]);
      console.log("indexToSet", indexToSet);
      let itemDataCopy = this.state.itemData; // copy itemsData from state to local
      // delete itemDataCopy.items[indexToSet]; // delete this item
      console.log(itemDataCopy.items);
      itemDataCopy.items.splice(indexToSet, 1); // delete this item
      console.log(itemDataCopy.items);
      // this.setState({ itemData: itemDataCopy }); // seems like it works even without this line
      // this.forceUpdate();

      // todo: this shows the wrong item as being deleted until you get out of edit mode
      // maybe something to do with async
   }

   // renders a one line card represenation of an item
   renderItemCardEdit(itemData) {
      return (
         <div
            className={
               "card item-card color" + String((this.state.level + 1) % 3)
            }
         >
            <div className="d-flex">
               <button
                  className="icon-container"
                  onClick={(e) => this.deleteItem(e)}
                  id={"delete-item-" + itemData.index}
               >
                  <IconClose />
               </button>
               <div className="flex-fill">
                  <input
                     className="edit-name"
                     id={"edit-name-input-" + itemData.index}
                     defaultValue={itemData.name}
                     onChange={(e) => this.setItemName(e)}
                  />
               </div>
               {MOVE_UPDOWN && (
                  <>
                     <div className="icon-container">
                        <IconChevronUp />
                     </div>
                     <div className="icon-container">
                        <IconChevronDown />
                     </div>
                  </>
               )}
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
      console.log("itemData", this.state.itemData);
      console.log("itemLevel", this.state.level);

      this.setItemNums(this.state.itemData); // count number of packed and total items inside this

      // these are classes that are different if we are at the top level or a lower level
      let pageBgClasses = "";
      let pageContentClasses = "";
      let levelHeaderClasses = "";
      let levelBodyClasses = "";
      if (this.state.level === 0) {
         pageBgClasses = "item-list color" + String(this.state.level % 3);
      } else {
         pageBgClasses = "item-list color" + String((this.state.level - 1) % 3);
         pageContentClasses =
            "card super-item-card color" + String(this.state.level % 3);
         levelHeaderClasses = "card-header";
         levelBodyClasses = "card-body";
      }

      return (
         <div>
            <Header />
            <div className={pageBgClasses}>
               <div className="container scroll-fix">
                  <div className="row">
                     <div className="col-12 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">
                        {this.state.parentName !== null && (
                           <div>
                              <Link
                                 className="up-level"
                                 onClick={(e) => {
                                    this.movePageToDifferentItem(
                                       this.state.itemIndexPath.slice(0, -1)
                                    ); // move to current path with the last part removed to go up a level
                                 }}
                              >
                                 <div className="icon left">
                                    <IconArrowThinLeftCircle />
                                 </div>
                                 Back to {this.state.parentName}
                              </Link>
                           </div>
                        )}
                        {/* <img src={iconEdit} className="icon" /> */}
                        <div className={pageContentClasses}>
                           <div className={levelHeaderClasses}>
                              <div className="row">
                                 <div className="col">
                                    <h4>{this.state.itemData.name}</h4>
                                 </div>
                                 {this.state.isEditMode === false && (
                                    <div className="col">
                                       <h4 className="float-right packed-counter">
                                          {this.state.itemData.numPackedItems} /{" "}
                                          {this.state.itemData.numItems}
                                       </h4>
                                    </div>
                                 )}
                              </div>

                              <div className="row">
                                 <div className="col">
                                    {/* <div className="custom-control custom-switch">
                                          <input
                                             type="checkbox"
                                             className="custom-control-input display-switch-label"
                                             id={
                                                "show-packed-switch" +
                                                this.state.itemData.name
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
                                                this.state.itemData.name
                                             }
                                          >
                                             Show {this.state.itemData.numPackedItems}{" "}
                                             Packed Item(s)
                                          </label>
                                       </div> */}

                                    {/* {this.state.isShowingPacked && (
                                          <div className="custom-control custom-switch">
                                             <input
                                                type="checkbox"
                                                className="custom-control-input display-switch-label"
                                                id={
                                                   "packed-on-bottom-switch" +
                                                   this.state.itemData.name
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
                                                   this.state.itemData.name
                                                }
                                             >
                                                Move Packed to Bottom
                                             </label>
                                          </div>
                                       )} */}

                                    {!this.state.isEditMode && (
                                       <button
                                          className="btn action-button"
                                          onClick={(e) => {
                                             this.unpackAll(
                                                this.state.itemData
                                             );
                                          }}
                                       >
                                          Unpack All
                                       </button>
                                    )}

                                    <div className="custom-control custom-switch float-right">
                                       <input
                                          type="checkbox"
                                          className="custom-control-input display-switch-label"
                                          id={
                                             "edit-mode-switch" +
                                             this.state.itemData.name
                                          }
                                          checked={this.state.isEditMode}
                                          onChange={(e) => {
                                             this.toggleEditMode(e);
                                          }}
                                       />
                                       <label
                                          className="custom-control-label display-switch-label"
                                          htmlFor={
                                             "edit-mode-switch" +
                                             this.state.itemData.name
                                          }
                                       >
                                          Edit Mode
                                       </label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className={levelBodyClasses}>
                              <div className="row">
                                 <div className="col">
                                    {this.renderContainingItems(
                                       this.state.itemData
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}
