import React from "react";
import Header from "../ui/Header";
// import { Link } from "react-router-dom"; // a React element for linking
import { gear } from "../../mock-data/gear";
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
import { MOVE_UPDOWN, MAX_ITEM_NAME_LENGTH } from "../../utils/helpers";
import classnames from "classnames";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";

class ItemList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      console.log("props.currentLoadout", props.currentLoadout);

      if (props.currentLoadout.gear.length === 0) {
         axios
            .get(
               "https://raw.githubusercontent.com/Chris-Fortier/loadout/master/src/mock-data/gear.json"
            )
            .then((res) => {
               // handle success
               // res is shorthand for response
               console.log(res);
               props.dispatch({
                  type: actions.STORE_CURRENT_LOADOUT,
                  payload: res.data,
               }); // dispatching an action
               // res.data is the data from the response
            })
            .catch((error) => {
               // handle error
               console.log(error);
            }); // .finally(function () {
         //   // always executed
         // });
      }

      // set default state values

      this.state = {
         isShowingPacked: true,
         isPackedOnBottom: true,
         isEditMode: false,
         isShowingUnpackConfirmation: false,

         subItemDisplayMode: "numUnpackedDescendants",
         // subItemDisplayMode can be "packedChildrenOutOfTotalChildren" or "numUnpackedDescendants"

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

      // get the number of unpacked descedants, could be useful in sorting by which items need the most "work"
      item.numUnpackedDescendants =
         item.numDescendants - item.numPackedDescendants;

      // generate the text that would be displayed to summarize the packed status of the contents of this item
      if (
         this.state.subItemDisplayMode === "packedChildrenOutOfTotalChildren"
      ) {
         item.contentSummaryText =
            item.numPackedChildren + " / " + item.numChildren;
      } else if (this.state.subItemDisplayMode === "numUnpackedDescendants") {
         if (item.numUnpackedDescendants > 0) {
            item.contentSummaryText = item.numUnpackedDescendants + " left";
         } else if (!item.isPacked) {
            item.contentSummaryText = "ready";
         } else {
            item.contentSummaryText = "packed";
         }
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

   // roll out a dialog
   rolloutUnpackConfirmation() {
      let itemsText = "";
      if (this.state.currentItem.numPackedChildren > 1) {
         itemsText = this.state.currentItem.numPackedChildren + " items";
      } else if (this.state.currentItem.numPackedChildren === 1) {
         itemsText = "1 item";
      }

      const numSubItems =
         this.state.currentItem.numPackedDescendants -
         this.state.currentItem.numPackedChildren;

      let subItemsText = "";
      if (numSubItems > 1) {
         subItemsText = numSubItems + " subitems";
      } else if (numSubItems === 1) {
         subItemsText = "1 subitem";
      }

      // set up the text of the unpack children button if there are packed children
      let unpackChildrenText = "";
      if (itemsText !== "") {
         unpackChildrenText = "unpack " + itemsText;
      }

      // set up the text of the unpack descendants button if there are packed descendants
      let unpackDescendantsText = "";
      if (itemsText !== "" && subItemsText !== "") {
         unpackDescendantsText = "unpack " + itemsText + " and " + subItemsText;
      } else if (subItemsText !== "") {
         unpackDescendantsText = "unpack " + subItemsText;
      }

      return (
         <div>
            <button
               className="text-button muted"
               onClick={(e) => {
                  this.hideUnpackConfirmation();
               }}
            >
               Cancel Unpack
            </button>
            {unpackChildrenText !== "" && (
               <button
                  className="text-button"
                  onClick={(e) => {
                     this.confirmUnpackChildren();
                  }}
               >
                  {unpackChildrenText}
               </button>
            )}

            {unpackDescendantsText !== "" && (
               <>
                  &nbsp;
                  <button
                     className="text-button"
                     onClick={(e) => {
                        this.confirmUnpackDescendants();
                     }}
                  >
                     {unpackDescendantsText}
                  </button>
               </>
            )}
         </div>
      );
   }

   confirmUnpackDescendants() {
      this.unpackDescendants(this.state.currentItem); // unpack all descendants of the current item
      this.hideUnpackConfirmation(); // close the message
   }

   confirmUnpackChildren() {
      this.unpackChildren(this.state.currentItem); // unpack all descendants of the current item
      this.hideUnpackConfirmation(); // close the message
   }

   // show the unpack all confirmation
   showUnpackConfirmation() {
      this.setState({ isShowingUnpackConfirmation: true });
   }

   // hide the unpack all confirmation
   hideUnpackConfirmation() {
      this.setState({ isShowingUnpackConfirmation: false }); // hide the unpack menu if it's open
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
      this.hideUnpackConfirmation();
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

   // toggle show packed items
   toggleIsPacked(itemIndex) {
      if (
         this.state.currentItem.items[itemIndex].numPackedChildren ===
         this.state.currentItem.items[itemIndex].numChildren
      ) {
         let currentItem = this.state.currentItem;
         currentItem.items[itemIndex].isPacked = !currentItem.items[itemIndex]
            .isPacked;
         this.setState({ currentItem: currentItem });
      }

      this.hideUnpackConfirmation();
   }

   // renders a one line card represenation of an item
   renderItemCard(item) {
      // console.log("render item card with this", item);

      let counterIsFaint = true;
      let packedBoxIsFaint = false;

      // do this if this item has subitems
      if (item.hasOwnProperty("items")) {
         // this will make the checkboxes disabled for items that don't have all their containing items packed
         if (item.numPackedChildren < item.numChildren) {
            counterIsFaint = false;
            packedBoxIsFaint = true;
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
                  <span
                     onClick={(e) => {
                        this.movePageToDifferentItem(
                           this.state.itemIndexPath.concat([item.index])
                        ); // move to current path with the subitem index added on
                     }}
                     className={classnames(
                        "flex-fill item-card-text navigation-link packed-counter",
                        { faint: counterIsFaint }
                     )}
                  >
                     <span className="item-card-icon float-right">
                        <IconArrowThinRightCircle />
                     </span>
                     <span className="float-right">&nbsp;</span>
                     <span className="float-right">
                        {item.contentSummaryText}
                     </span>
                  </span>
               )}
            </div>
         </div>
      );
   }

   // updates the displayed name field of one of the current item's subitems
   setSubItemName(e) {
      // figure out which subitem we are editing the name of based on the id of the input
      const splitId = e.target.id.split("-");
      const indexToSet = parseInt(splitId[splitId.length - 1]);

      let itemDataCopy = this.state.currentItem; // copy itemsData from state to local
      itemDataCopy.items[indexToSet].name = e.target.value; // change the desired item's name to match input
      // this.setState({ itemData: itemDataCopy }); // seems like it works even without this line
      this.setState({ currentItem: itemDataCopy }); // makes it update the input that the user can see
   }

   // sets the name of the current item (the item which the entire page is currently the focus of)
   setCurrentItemName(e) {
      let itemDataCopy = this.state.currentItem; // copy itemsData from state to local
      itemDataCopy.name = e.target.value; // change the desired item's name to match input
      this.setState({ currentItem: itemDataCopy }); // makes it update the input that the user can see
   }

   // deletes an item
   deleteItem(indexToDelete) {
      console.log("deleting an item");
      console.log(
         "item we are deleting",
         indexToDelete,
         this.state.currentItem.items[indexToDelete].name
      );
      if (this.state.currentItem.items[indexToDelete].numDescendants > 0) {
         console.log(
            "Are you sure you want to delete " +
               this.state.currentItem.items[indexToDelete].name +
               " and its " +
               this.state.currentItem.items[indexToDelete].numDescendants +
               " subitems?"
         );
      }
      let itemDataCopy = this.state.currentItem; // copy itemsData from state to local
      itemDataCopy.items.splice(indexToDelete, 1); // delete this item
      this.forceUpdate();
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
                     value={item.name}
                     onChange={(e) => this.setSubItemName(e)}
                     maxLength={MAX_ITEM_NAME_LENGTH}
                  />
               </span>
               <button
                  className="icon-clickable item-card-icon"
                  id={"delete-item-" + item.index}
                  onClick={() => this.deleteItem(item.index)}
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

      let displayedItems = []; // initialize a new list for displayed items

      // displayedItems = orderBy(items, "name", "asc"); // sort the items by name
      displayedItems = items;

      // order by which items have the most unpacked subitems
      displayedItems = orderBy(displayedItems, "numUnpackedDescendants", "asc");

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
               <div className="container-fluid item-cards-container scroll-fix">
                  <div className="row">
                     <div className="col">
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
                        {/* the following adds empty space above the super card in edit mode so it doesn't shift */}
                        {this.state.currentItem.level !== 0 &&
                           this.state.isEditMode && (
                              <div className="up-level">
                                 <br />
                              </div>
                           )}

                        {/* <img src={iconEdit} className="icon" /> */}
                        <div className={pageContentClasses}>
                           <div className={levelHeaderClasses}>
                              <div className="row">
                                 {!this.state.isEditMode && (
                                    <>
                                       <div className="col">
                                          <h4>{this.state.currentItem.name}</h4>
                                       </div>
                                       <div className="col">
                                          <h4 className="float-right packed-counter">
                                             {
                                                this.state.currentItem
                                                   .contentSummaryText
                                             }
                                          </h4>
                                       </div>
                                    </>
                                 )}
                                 {this.state.isEditMode && (
                                    <div className="col">
                                       <span className="flex-fill">
                                          <h4>
                                             <input
                                                className="edit-name"
                                                value={
                                                   this.state.currentItem.name
                                                }
                                                onChange={(e) =>
                                                   this.setCurrentItemName(e)
                                                }
                                                maxLength={MAX_ITEM_NAME_LENGTH}
                                             />
                                          </h4>
                                       </span>
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
                                          {this.state.currentItem
                                             .numPackedDescendants > 0 &&
                                             !this.state
                                                .isShowingUnpackConfirmation && (
                                                <button
                                                   className="text-button muted"
                                                   onClick={() => {
                                                      this.showUnpackConfirmation();
                                                   }}
                                                >
                                                   Unpack
                                                </button>
                                             )}
                                          {this.state
                                             .isShowingUnpackConfirmation &&
                                             this.rolloutUnpackConfirmation()}
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

// maps the store to props
function mapStateToProps(state) {
   return {
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(ItemList); // this is "currying"
