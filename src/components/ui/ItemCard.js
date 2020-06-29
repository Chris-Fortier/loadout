import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
import actions from "../../store/actions";
import {
   LEVEL_COLORS,
   SUBITEM_DISPLAY_MODE,
   UI_APPEARANCE,
} from "../../utils/helpers";
import classnames from "classnames";
// import { IconArrowThinRightCircle } from "../../icons/icons.js";
import {
   PackedIcon,
   ReadyToPackIcon,
   NotReadyToPackIcon,
   ChildrenUnpackedIcon,
   ChildrenPackedIcon,
} from "../../icons/loadout-icons.js";

class ItemCard extends React.Component {
   // TODO: duplicated code, how can I put this in a module?
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
      if (SUBITEM_DISPLAY_MODE === "packedChildrenOutOfTotalChildren") {
         item.contentSummaryText =
            item.numPackedChildren + " / " + item.numChildren;
      } else if (SUBITEM_DISPLAY_MODE === "numUnpackedDescendants") {
         if (item.numUnpackedDescendants > 0) {
            item.contentSummaryText = item.numUnpackedDescendants + " left";
         } else if (!item.isPacked) {
            item.contentSummaryText = "ready";
         } else {
            item.contentSummaryText = "";
         }
      } else if (SUBITEM_DISPLAY_MODE === "numUnpackedChildren") {
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
   // end duplicated code

   // move page to a different item
   movePageToDifferentItem(itemIndexPath) {
      this.props.dispatch({
         type: actions.CHANGE_ITEM_INDEX_PATH,
         payload: itemIndexPath,
      });

      // this.setCurrentItem(itemIndexPath);

      // this.setState({ isEditMode: false, isShowingUnpackConfirmation: false }); // get out of edit mode if the current item changes
      // this.props.history.push("/loadout");

      window.scrollTo(0, 0); // sets focus to the top of the page
   }

   // toggle the packed status of this item
   toggleIsPacked(itemIndexPath) {
      console.log("toggleIsPacked()...");
      // if (
      //    !this.props.item.isPacked &&
      //    this.props.item.numPackedChildren === this.props.item.numChildren
      // ) {
      //    console.log("packing " + this.props.item.name);
      // } else if (this.props.item.isPacked) {
      //    console.log("unpacking " + this.props.item.name);
      // }

      // this.hideUnpackConfirmation();

      // only toggle packed if all its descendants are packed
      if (this.props.item.numPackedChildren === this.props.item.numChildren) {
         // copyOfGear.lastChange = "test hello";
         console.log("itemIndexPath:", itemIndexPath);

         // get the actual item I want to change based on the index path
         let copyOfGear = this.props.currentLoadout.gear;
         let currentItem = copyOfGear;
         for (let i in itemIndexPath) {
            currentItem = currentItem.items[itemIndexPath[i]]; // go one lever deeper for each index in itemIndexPath
         }
         console.log("name of target item:", currentItem.name);

         // copyOfGear.items[0].items[1].isPacked = !copyOfGear.items[0].items[1]
         //    .isPacked;
         currentItem.isPacked = !currentItem.isPacked;

         // put the data back into the store
         this.props.dispatch({
            type: actions.STORE_CURRENT_LOADOUT,
            payload: copyOfGear,
         });

         this.processAllItems();
      }
   }

   render() {
      // let counterIsFaint = true;
      // let packedBoxIsFaint = false;
      const item = this.props.item; // this is to simplify code below
      let level = item.level;

      let thisItemPath = this.props.currentLoadout.itemIndexPath.concat([
         item.index,
      ]); // stores the complete index path to the item referred to on this item card

      // do this if this item has subitems
      // if (item.hasOwnProperty("items")) {
      //    // this will make the checkboxes disabled for items that don't have all their containing items packed
      //    if (item.numPackedChildren < item.numChildren) {
      //       counterIsFaint = false;
      //       packedBoxIsFaint = true;
      //    }
      // }

      return (
         <div
            className={classnames(
               level > 1 && "item-card",
               level <= 1 && "loadout-card",
               UI_APPEARANCE === "light" && level > 1 && "child-bg-light",
               UI_APPEARANCE === "dark" && level > 1 && "child-bg-dark",
               UI_APPEARANCE === "colors" &&
                  level > 1 &&
                  "child-color-" + String(level % LEVEL_COLORS)
            )}
            id={"item-card-" + item.index}
         >
            {/* <div className="float-left"> */}
            <div className="d-flex">
               {level <= 1 && (
                  <span
                     className={classnames(
                        "flex-fill item-card-text",
                        (UI_APPEARANCE === "light" ||
                           UI_APPEARANCE === "dark") &&
                           "level-text-color-" + String(level % LEVEL_COLORS),
                        UI_APPEARANCE === "colors" && "dark-text-color"
                     )}
                  >
                     <span
                        className="navigation-link"
                        onClick={(e) => {
                           this.movePageToDifferentItem(thisItemPath); // move to current path with the subitem index added on
                        }}
                     >
                        {item.name}
                     </span>
                  </span>
               )}

               {level > 1 && (
                  <>
                     <span
                        className={classnames(
                           "icon item-card-icon",
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "dark") &&
                              "item-icon-colors-" +
                                 String(level % LEVEL_COLORS),
                           UI_APPEARANCE === "colors" && "item-icon-colors",
                           {
                              clickable:
                                 item.numPackedChildren === item.numChildren,
                              disabled:
                                 item.numPackedChildren < item.numChildren,
                           }
                        )}
                        onClick={(e) => {
                           this.toggleIsPacked(thisItemPath);
                        }}
                     >
                        {item.isPacked && <PackedIcon />}
                        {!item.isPacked &&
                           item.numPackedChildren >= item.numChildren && (
                              <ReadyToPackIcon />
                           )}
                        {!item.isPacked &&
                           item.numPackedChildren < item.numChildren && (
                              <NotReadyToPackIcon />
                           )}
                     </span>
                     <span
                        className={classnames(
                           "flex-fill item-card-text",
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "dark") &&
                              "level-text-color-" +
                                 String(level % LEVEL_COLORS),
                           UI_APPEARANCE === "colors" && "light-text-color"
                        )}
                     >
                        <span
                           className={classnames({
                              clickable:
                                 item.numPackedChildren === item.numChildren,
                              // disabled:
                              //    item.numPackedChildren < item.numChildren,
                           })}
                           onClick={(e) => {
                              this.toggleIsPacked(thisItemPath);
                           }}
                        >
                           &nbsp;&nbsp;{item.name}
                        </span>
                     </span>
                  </>
               )}

               {item.hasOwnProperty("items") && (
                  <>
                     <span
                        onClick={(e) => {
                           !item.isPacked &&
                              this.movePageToDifferentItem(thisItemPath); // move to current path with the subitem index added on
                        }}
                        className={classnames(
                           "button navigation-link item-card-text",
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "dark") &&
                              "level-text-color-" +
                                 String((level + 1) % LEVEL_COLORS),
                           UI_APPEARANCE === "colors" && "dark-text-color",
                           { disabled: item.isPacked }
                        )}
                     >
                        {item.contentSummaryText}&nbsp;&nbsp;
                     </span>

                     <span
                        className={classnames(
                           "icon item-card-icon",
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "dark") &&
                              "item-icon-colors-" +
                                 String(level % LEVEL_COLORS),
                           UI_APPEARANCE === "colors" && "item-icon-colors",
                           {
                              clickable: !item.isPacked,
                              disabled: item.isPacked,
                           }
                        )}
                        onClick={(e) => {
                           !item.isPacked &&
                              this.movePageToDifferentItem(thisItemPath); // move to current path with the subitem index added on
                        }}
                     >
                        {item.isPacked && <ChildrenPackedIcon />}
                        {!item.isPacked &&
                           item.numPackedChildren >= item.numChildren && (
                              <ChildrenPackedIcon />
                           )}
                        {!item.isPacked &&
                           item.numPackedChildren < item.numChildren && (
                              <ChildrenUnpackedIcon />
                           )}
                     </span>
                  </>
               )}
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

export default connect(mapStateToProps)(ItemCard); // this is "currying"
