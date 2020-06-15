import React from "react";
import Header from "../ui/Header";
// import { Link } from "react-router-dom"; // a React element for linking
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
   IconTrash,
   IconChevronDown,
   IconChevronUp,
} from "../../icons/icons.js";
import { MOVE_UPDOWN } from "../../utils/helpers";
import classnames from "classnames";

export default class ItemList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // set default state values

      this.state = {
         isShowingPacked: true,
         isPackedOnBottom: true,
         isEditMode: false,

         rootItem: gear, // stores all the item data from the abolsute root
         currentItem: gear, // stores the item data where the item of this page is at the root level
         itemIndexPath: [],
      };
   }

   // methods happen here, such as what happens when you click on a button

   // this goes through all of an items descendants and sets derived variables and other stuff
   processItemAndDescendants(item, level = null) {
      let nextLevel = level;
      if (level !== null) {
         item.level = level;
         nextLevel = level + 1;
      }

      // if this item has subitems, fix the subitems
      if (item.hasOwnProperty("items")) {
         console.log("fixing data for the sub items of", item.name);

         item.numChildren = item.items.length;
         item.numDescendants = item.numChildren;
         item.numPackedChildren = 0; // intialize this and count below
         item.numPackedDescendants = 0; // intialize this and count below

         for (let i in item.items) {
            item.items[i].parentName = item.name;
            item.items[i].index = parseInt(i);
            // item.items[i].fixed = true;
            if (item.items[i].isPacked) {
               item.numPackedChildren++; // count a packed child
               item.numPackedDescendants++; // also count as a packed descendant
            }
            const descendantInfo = this.processItemAndDescendants(
               item.items[i],
               nextLevel
            );

            // add descendant info to this item's couters
            item.numDescendants =
               item.numDescendants + descendantInfo.numDescendants;
            item.numPackedDescendants =
               item.numPackedDescendants + descendantInfo.numPackedDescendants;
         }

         // if any descendant is unpacked, this should be unpacked also
         if (item.numPackedDescendants < item.numDescendants) {
            item.isPacked = false;
         }
      } else {
         item.numChildren = 0;
         item.numDescendants = 0;
         item.numPackedChildren = 0;
         item.numPackedDescendants = 0;
      }

      return {
         numDescendants: item.numDescendants,
         numPackedDescendants: item.numPackedDescendants,
      };
   }

   // fixes all item data
   processAllItems() {
      this.processItemAndDescendants(this.state.rootItem, 0);
   }

   // move page to a different item
   movePageToDifferentItem(itemIndexPath) {
      let parentName = null; // initialize the name of the parent
      let itemLevel = 0; // initialize the value that stores how many levels deep this page's item's level is
      let currentItem = this.state.rootItem;
      for (let levelIndex in itemIndexPath) {
         parentName = currentItem.name;
         currentItem = currentItem.items[parseInt(itemIndexPath[levelIndex])];
         itemLevel++;
      }

      this.setState({
         currentItem: currentItem,
         parentName: parentName,
         level: itemLevel,
         itemIndexPath: itemIndexPath,
      });

      this.setState({ isEditMode: false }); // get out of edit mode if the current item changes

      window.scrollTo(0, 0); // sets focus to the top of the page
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

   // this unpacks all a given item's children and all their descendants
   unpackDescendants(item) {
      console.log("unpacking", item.name);
      for (let i in item.items) {
         item.items[i].isPacked = false;
         if (item.items[i].hasOwnProperty("items")) {
            // unpack all this item's items and so on
            this.unpackDescendants(item.items[i]);
         }
      }
      this.setState({ currentItem: item });
   }

   // this unpacks all a given item's children
   unpackChildren(item) {
      // the item parameter is the item that we are unpacking all the children of
      console.log("unpacking", item.name);
      for (let i in item.items) {
         item.items[i].isPacked = false;
      }
      this.setState({ currentItem: item });
   }

   rolloutUnpackConfirmation() {}

   // toggle show packed items
   toggleIsPacked(itemIndex) {
      // this.setItemNums(itemData); // make sure the number of packed items this has is up to date
      // console.log(itemData.numPackedChildren);
      if (
         this.state.currentItem.items[itemIndex].numPackedChildren ===
         this.state.currentItem.items[itemIndex].numChildren
      ) {
         // itemData.isPacked = !itemData.isPacked;
         // this.forceUpdate(); // forces re-render, hacky way
         // console.log("itemData.isPacked", itemData.isPacked);
         // console.log("this.props", this.props);
         let currentItem = this.state.currentItem;
         currentItem.items[itemIndex].isPacked = !currentItem.items[itemIndex]
            .isPacked;
         this.setState({ currentItem: currentItem });
      }
   }

   // // this sets the packed number of items and the total number of items
   // setItemNums(item) {
   //    item.numChildren = item.items.length;

   //    // find the number of packed items by counting how many have packed set to true
   //    item.numPackedChildren = item.items.reduce((numPacked, item) => {
   //       if (item.isPacked) {
   //          return (numPacked += 1);
   //       } else {
   //          return numPacked;
   //       }
   //    }, 0);
   // }

   // linkTo(itemIndex) {
   //    this.props.history.push(window.location.pathname + "-" + itemIndex);
   // }

   // renders a one line card represenation of an item
   renderItemCard(item) {
      // console.log("render item card with this", item);

      let counterIsFaint = true;
      let packedBoxIsFaint = false;

      // let checkBoxClassSuffix = "";
      // do this if this item has subitems
      if (item.hasOwnProperty("items")) {
         // this.setItemNums(item); // find the number of items packed and total number of items

         // this will make the checkboxes disabled for items that don't have all their containing items packed
         if (item.numPackedChildren < item.numChildren) {
            counterIsFaint = false;
            packedBoxIsFaint = true;
            // checkBoxClassSuffix = " faint";
         }
      }

      return (
         <div
            className={
               "card item-card color" +
               String((this.state.currentItem.level + 1) % 3)
            }
         >
            {/* <div className="float-left"> */}
            <div className="d-flex">
               <span
                  // className={
                  //    "float-left custom-control custom-checkbox icon-container" +
                  //    checkBoxClassSuffix
                  // }
                  className={classnames(
                     "float-left custom-control custom-checkbox packed-checkbox-container",
                     { faint: packedBoxIsFaint }
                  )}
               >
                  <input
                     className="custom-control-input"
                     type="checkbox"
                     id={"packed-checkbox-" + item.index}
                     checked={item.isPacked}
                     onChange={(e) => {
                        this.toggleIsPacked(item.index);
                     }}
                  />
                  {/* for some reason if I don't have a label, the entire checkbox is not visible */}
                  <label
                     className="custom-control-label"
                     htmlFor={"packed-checkbox-" + item.index}
                  ></label>
               </span>
               <span className="flex-fill item-card-text">{item.name}</span>
               {item.hasOwnProperty("items") && (
                  <span className="flex-fill item-card-text">
                     <span
                        // to={window.location.pathname + "-" + item.index}
                        onClick={(e) => {
                           this.movePageToDifferentItem(
                              this.state.itemIndexPath.concat([item.index])
                           ); // move to current path with the subitem index added on
                        }}
                        className={classnames(
                           "float-right navigation-link packed-counter",
                           { faint: counterIsFaint }
                        )}
                     >
                        {item.numPackedChildren} / {item.numChildren}
                        <span className="item-card-icon float-right">
                           <IconArrowThinRightCircle />
                        </span>
                     </span>
                  </span>
               )}
            </div>
         </div>
      );
   }

   // updates the displayed name field of the item based on user input
   setItemName(e) {
      const splitId = e.target.id.split("-");
      const indexToSet = parseInt(splitId[splitId.length - 1]);
      let itemDataCopy = this.state.currentItem; // copy itemsData from state to local
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
      let itemDataCopy = this.state.currentItem; // copy itemsData from state to local
      // delete itemDataCopy.items[indexToSet]; // delete this item
      console.log(itemDataCopy.items);
      itemDataCopy.items.splice(indexToSet, 1); // delete this item
      console.log(itemDataCopy.items);
      // this.setState({ itemData: itemDataCopy }); // seems like it works even without this line
      this.forceUpdate();

      // todo: this shows the wrong item as being deleted until you get out of edit mode
      // maybe something to do with async
   }

   // renders a one line card represenation of an item
   renderItemCardEdit(item) {
      return (
         <div
            className={
               "card item-card color" +
               String((this.state.currentItem.level + 1) % 3)
            }
         >
            <div className="d-flex">
               <span className="flex-fill">
                  <input
                     className="edit-name"
                     id={"edit-name-input-" + item.index}
                     defaultValue={item.name}
                     onChange={(e) => this.setItemName(e)}
                  />
               </span>
               <button
                  className="icon-clickable item-card-icon"
                  onClick={(e) => this.deleteItem(e)}
                  id={"delete-item-" + item.index}
               >
                  <IconTrash />
               </button>
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

   renderContainingItems(parentItem) {
      const items = parentItem.items; // to simplify code below

      // get indices and levels for each item
      // for (let i in items) {
      //    items[i].index = i; // set an index (used in their pages' urls)
      //    items[i].level = parentItem.level + 1; // set the level to each child item to this level plus one
      // }
      // todo: this might be redundant

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
      console.log("Rendering page...");
      // console.log("currentItem", this.state.currentItem);

      this.processAllItems();
      console.log("this.state.currentItem.", this.state.currentItem.level);

      // this.setItemNums(this.state.currentItem); // count number of packed and total items inside this
      // todo: can probably put this in the fix function

      // these are classes that are different if we are at the top level or a lower level
      let pageBgClasses = "";
      let pageContentClasses = "";
      let levelHeaderClasses = "";
      let levelBodyClasses = "";
      if (this.state.currentItem.level === 0) {
         pageBgClasses =
            "item-list color" + String(this.state.currentItem.level % 3);
      } else {
         pageBgClasses =
            "item-list color" + String((this.state.currentItem.level - 1) % 3);
         pageContentClasses =
            "card super-item-card color" +
            String(this.state.currentItem.level % 3);
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
                        {this.state.currentItem.level !== 0 &&
                           !this.state.isEditMode && (
                              <div>
                                 <span
                                    className="up-level navigation-link"
                                    onClick={(e) => {
                                       this.movePageToDifferentItem(
                                          this.state.itemIndexPath.slice(0, -1)
                                       ); // move to current path with the last part removed to go up a level
                                    }}
                                 >
                                    <div className="icon left">
                                       <IconArrowThinLeftCircle />
                                    </div>
                                    Back to {this.state.currentItem.parentName}
                                 </span>
                              </div>
                           )}
                        {/* <img src={iconEdit} className="icon" /> */}
                        <div className={pageContentClasses}>
                           <div className={levelHeaderClasses}>
                              <div className="row">
                                 <div className="col">
                                    <h4>{this.state.currentItem.name}</h4>
                                 </div>
                                 {this.state.isEditMode === false && (
                                    <div className="col">
                                       <h4 className="float-right packed-counter">
                                          {
                                             this.state.currentItem
                                                .numPackedChildren
                                          }{" "}
                                          / {this.state.currentItem.numChildren}
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
                                                this.state.currentItem.name
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
                                                this.state.currentItem.name
                                             }
                                          >
                                             Show {this.state.currentItem.numPackedChildren}{" "}
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
                                                   this.state.currentItem.name
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
                                                   this.state.currentItem.name
                                                }
                                             >
                                                Move Packed to Bottom
                                             </label>
                                          </div>
                                       )} */}

                                    {!this.state.isEditMode && (
                                       <>
                                          <button
                                             className="btn action-button"
                                             onClick={(e) => {
                                                this.unpackDescendants(
                                                   this.state.currentItem
                                                );
                                             }}
                                          >
                                             Unpack All
                                          </button>
                                          {/* Are you sure you want to unpack &nbsp;
                                          {
                                             this.state.currentItem
                                                .numPackedDescendants
                                          }
                                          &nbsp; total subitems? */}
                                       </>
                                    )}

                                    <div className="custom-control custom-switch float-right">
                                       <input
                                          type="checkbox"
                                          className="custom-control-input display-switch-label"
                                          id={
                                             "edit-mode-switch" +
                                             this.state.currentItem.name
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
                                             this.state.currentItem.name
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
                                       this.state.currentItem
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
