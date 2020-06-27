import React from "react";
import Header from "../ui/Header";
import orderBy from "lodash/orderBy";
import {
   // IconEdit,
   // IconCog,
   // IconAddCircle,
   // IconArrowThickUpCircle,
   // IconArrowThickDownCircle,
   // IconArchive,
   IconArrowThinLeftCircle,
   // IconArrowThinRightCircle,
   // IconTrash,
   // IconChevronDown,
   // IconChevronUp,
   IconUserCouple,
} from "../../icons/icons.js";
import {
   // MOVE_UPDOWN,
   MAX_ITEM_NAME_LENGTH,
   LEVEL_COLORS,
   UI_APPEARANCE,
} from "../../utils/helpers";
import classnames from "classnames";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";
import ItemCard from "../ui/ItemCard";
import ItemCardEdit from "../ui/ItemCardEdit";
import { Link } from "react-router-dom"; // a React element for linking

class ItemList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      console.log("props.currentLoadout", props.currentLoadout);

      if (props.currentLoadout.gear.length === 0) {
         axios
            .get(
               "https://raw.githubusercontent.com/Chris-Fortier/loadout/master/src/mock-data/loadouts.json"
            )
            .then((res) => {
               // handle success
               // res is shorthand for response
               console.log(res);
               props.dispatch({
                  type: actions.STORE_CURRENT_LOADOUT,
                  payload: res.data,
               }); // dispatching an action
               this.processAllItems(); // initial processing of items that creates derived properties
               // res.data is the data from the response
            })
            .catch((error) => {
               // handle error
               console.log(error);
            });
      }

      // set default state values

      this.state = {
         isShowingPacked: true,
         isPackedOnBottom: true,
         isEditMode: false,
         isShowingUnpackConfirmation: false,

         subItemDisplayMode: "numUnpackedChildren",
         // subItemDisplayMode can be "packedChildrenOutOfTotalChildren" or "numUnpackedDescendants" or "numUnpackedChildren"
      };
   }

   // methods happen here, such as what happens when you click on a button

   // this goes through all of an item's descendants and sets derived variables and other stuff
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
      item.numUnpackedChildren = item.numChildren - item.numPackedChildren;

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
            item.contentSummaryText = "";
         }
      } else if (this.state.subItemDisplayMode === "numUnpackedChildren") {
         if (item.numUnpackedChildren > 0) {
            item.contentSummaryText = item.numUnpackedChildren + " left";
         } else if (!item.isPacked) {
            item.contentSummaryText = "ready";
         } else {
            item.contentSummaryText = "";
         }
      }

      return {
         numDescendants: item.numDescendants,
         numPackedDescendants: item.numPackedDescendants,
      };
   }

   // processing all item data and put the result back into the store
   processAllItems() {
      // console.log("processing all items");
      const rootItem = this.props.currentLoadout.gear;
      this.processItemAndDescendants(rootItem, 0);

      // put the processed data back into the store
      this.props.dispatch({
         type: actions.STORE_CURRENT_LOADOUT,
         payload: rootItem,
      });

      this.forceUpdate();
   }

   // roll out a dialog for unpacking an item's contents
   rolloutUnpackConfirmation() {
      const currentItem = this.getItemFromStore(); // get the current item from store based on the store's itemIndexPath

      let itemsText = "";
      if (currentItem.numPackedChildren > 1) {
         itemsText = currentItem.numPackedChildren + " items";
      } else if (currentItem.numPackedChildren === 1) {
         itemsText = "1 item";
      }

      const numSubItems =
         currentItem.numPackedDescendants - currentItem.numPackedChildren;

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
      this.unpackDescendants(this.getItemFromStore()); // unpack all descendants of the current item
      this.hideUnpackConfirmation(); // close the message
   }

   confirmUnpackChildren() {
      this.unpackChildren(this.getItemFromStore()); // unpack all descendants of the current item
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

   // return the current item from state based on an itemIndexPath
   getItemFromStore() {
      const itemIndexPath = this.props.currentLoadout.itemIndexPath;
      console.log("getItemFromStore()...");
      console.log("itemIndexPath", itemIndexPath);
      let currentItem = this.props.currentLoadout.gear; // start at the top of the heirarchy

      // for each part of the itemIndexPath
      for (let levelIndex in itemIndexPath) {
         currentItem = currentItem.items[parseInt(itemIndexPath[levelIndex])];
      }

      currentItem.level = itemIndexPath.length; // put the level of the current item in the current item

      return currentItem;
   }

   // goes back to the loadouts page
   exitLoadout() {
      console.log("exitLoadout()...");
      // remove the store of the loadout
      this.props.dispatch({
         type: actions.CLEAR_CURRENT_LOADOUT,
         payload: {},
      });
   }

   // move page to a different item
   movePageToDifferentItem(itemIndexPath) {
      console.log("movePageToDifferentItem()...itemIndexPath:", itemIndexPath);
      this.props.dispatch({
         type: actions.CHANGE_ITEM_INDEX_PATH,
         payload: itemIndexPath,
      });

      this.setState({ isEditMode: false, isShowingUnpackConfirmation: false }); // get out of edit mode if the current item changes

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
      console.log("Unpacking the descendants of " + item.name);
      // console.log("unpacking", item.name);
      // for (let i in item.items) {
      //    item.items[i].isPacked = false;
      //    if (item.items[i].hasOwnProperty("items")) {
      //       // unpack all this item's items and so on
      //       this.unpackDescendants(item.items[i]);
      //    }
      // }
      // this.setState({ currentItem: item });
   }

   // this unpacks all a given item's children
   unpackChildren(item) {
      console.log("Unpacking the children of " + item.name);
      // the item parameter is the item that we are unpacking all the children of
      // console.log("unpacking", item.name);
      // for (let i in item.items) {
      //    item.items[i].isPacked = false;
      // }
      // this.setState({ currentItem: item });
   }

   // sets the name of the current item (the item which the entire page is currently the focus of)
   setCurrentItemName(e) {
      const currentItem = this.getItemFromStore();
      console.log("rename " + currentItem.name + " to " + e.target.value);
      // let itemDataCopy = this.state.currentItem; // copy itemsData from state to local
      // itemDataCopy.name = e.target.value; // change the desired item's name to match input
      // this.setState({ currentItem: itemDataCopy }); // makes it update the input that the user can see
   }

   renderContainingItems(parentItem) {
      const items = parentItem.items; // to simplify code below

      console.log("Rendering containing items of", parentItem.name);

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
         return displayedItems.map((item) => (
            <ItemCardEdit item={item} key={item.id} />
         ));
      } else {
         // do packing mode version of item cards
         return displayedItems.map((item) => (
            <ItemCard item={item} key={item.id} />
         ));
      }
   }

   render() {
      console.log("Rendering page...");

      // these are classes that are different if we are at the top level or a lower level
      // let pageBgClasses = "";
      // let pageContentClasses = "";
      // let levelHeaderClasses = "";
      // let levelBodyClasses = "";

      // get the current item
      // const currentItem = this.state.currentItem; // old value
      // const currentItem = this.props.currentLoadout.gear; // redux value
      const currentItem = this.getItemFromStore(); // get the current item from store based on the store's itemIndexPath
      console.log("currentItem.level", currentItem.level);

      // this.props.item = currentItem; // set the props of item for this component to the current item

      const level = currentItem.level;
      // if (level !== 0) {
      //    // pageContentClasses = "card super-item-card this-bg-light";
      //    levelHeaderClasses = "card-header";
      //    levelBodyClasses = "card-body";
      // }

      return (
         <div>
            <Header />
            <div
               className={classnames(
                  "item-list",
                  UI_APPEARANCE === "light" && "parent-bg-light",
                  UI_APPEARANCE === "dark" && "parent-bg-dark",
                  UI_APPEARANCE === "colors" &&
                     level !== 0 &&
                     "parent-color-" + String((level - 1) % LEVEL_COLORS),
                  UI_APPEARANCE === "colors" && level === 0 && "parent-color-0"
               )}
            >
               <div className="container-fluid item-cards-container scroll-fix">
                  <div className="row">
                     <div className="col">
                        <div>
                           <span
                              className={classnames(
                                 "up-level button navigation-link",
                                 (UI_APPEARANCE === "light" ||
                                    UI_APPEARANCE === "dark") &&
                                    "level-text-color-" +
                                       String(
                                          (level + LEVEL_COLORS - 1) %
                                             LEVEL_COLORS
                                       ),
                                 UI_APPEARANCE === "colors" &&
                                    "light-text-color",
                                 {
                                    hidden: this.state.isEditMode,
                                 }
                              )}
                              onClick={(e) => {
                                 this.movePageToDifferentItem(
                                    this.props.currentLoadout.itemIndexPath.slice(
                                       0,
                                       -1
                                    )
                                 ); // move to current path with the last part removed to go up a level
                              }}
                           >
                              <div className="icon left">
                                 <IconArrowThinLeftCircle />
                              </div>
                              Back to {currentItem.parentName}
                           </span>
                        </div>

                        {/* the following adds empty space above the super card in edit mode so it doesn't shift */}
                        {/* {level !== 0 && this.state.isEditMode && (
                           <div className="up-level">
                              <br />
                           </div>
                        )} */}

                        {/* <img src={iconEdit} className="icon" /> */}
                        <div
                           className={classnames(
                              level !== 0 && "card super-item-card",
                              level !== 0 &&
                                 UI_APPEARANCE === "light" &&
                                 "this-bg-light",
                              level !== 0 &&
                                 UI_APPEARANCE === "dark" &&
                                 "this-bg-dark",
                              level !== 0 &&
                                 UI_APPEARANCE === "colors" &&
                                 "level-color-" + String(level % LEVEL_COLORS)
                           )}
                        >
                           <div className={level !== 0 && "card-header"}>
                              <div className="row">
                                 {!this.state.isEditMode && (
                                    <>
                                       <div className="col">
                                          <h4
                                             className={classnames(
                                                (UI_APPEARANCE === "light" ||
                                                   UI_APPEARANCE === "dark") &&
                                                   "level-text-color-" +
                                                      String(
                                                         level % LEVEL_COLORS
                                                      ),
                                                UI_APPEARANCE === "colors" &&
                                                   "dark-text-color"
                                             )}
                                          >
                                             {currentItem.name}
                                          </h4>
                                       </div>
                                       <div className="col">
                                          <h4
                                             className={classnames(
                                                "float-right",
                                                (UI_APPEARANCE === "light" ||
                                                   UI_APPEARANCE === "dark") &&
                                                   "level-text-color-" +
                                                      String(
                                                         (level + 1) %
                                                            LEVEL_COLORS
                                                      ),
                                                UI_APPEARANCE === "colors" &&
                                                   "light-text-color"
                                             )}
                                          >
                                             {currentItem.contentSummaryText}
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
                                                defaultValue={currentItem.name}
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
                                    {!this.state.isEditMode && (
                                       <>
                                          {currentItem.numPackedDescendants >
                                             0 &&
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

                                    {this.state.isEditMode && (
                                       <Link
                                          className="up-level navigation-link"
                                          to="/loadout-sharing"
                                       >
                                          <div className="icon left">
                                             <IconUserCouple />
                                          </div>
                                          Loadout Sharing Settings
                                       </Link>
                                    )}

                                    <div className="custom-control custom-switch float-right">
                                       <input
                                          type="checkbox"
                                          className="custom-control-input display-switch-label"
                                          id={
                                             "edit-mode-switch" +
                                             currentItem.name
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
                                             currentItem.name
                                          }
                                       >
                                          Edit Mode
                                       </label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className={level !== 0 && "card-body"}>
                              <div className="row">
                                 <div className="col">
                                    {this.renderContainingItems(currentItem)}
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
