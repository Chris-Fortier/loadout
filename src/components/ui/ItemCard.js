import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
import actions from "../../store/actions";
import { LEVEL_COLORS } from "../../utils/helpers";
import classnames from "classnames";
import { IconArrowThinRightCircle } from "../../icons/icons.js";
import {
   PackedIcon,
   ReadyToPackIcon,
   NotReadyToPackIcon,
   ChildrenUnpackedIcon,
   ChildrenPackedIcon,
} from "../../icons/loadout-icons.js";

class ItemCard extends React.Component {
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
   toggleIsPacked() {
      if (
         !this.props.item.isPacked &&
         this.props.item.numPackedChildren === this.props.item.numChildren
      ) {
         console.log("packing " + this.props.item.name);
      } else if (this.props.item.isPacked) {
         console.log("unpacking " + this.props.item.name);
      }

      // this.hideUnpackConfirmation();
   }

   render() {
      let counterIsFaint = true;
      let packedBoxIsFaint = false;
      const item = this.props.item; // this is to simplify code below

      // do this if this item has subitems
      if (item.hasOwnProperty("items")) {
         // this will make the checkboxes disabled for items that don't have all their containing items packed
         if (item.numPackedChildren < item.numChildren) {
            counterIsFaint = false;
            packedBoxIsFaint = true;
         }
      }

      return (
         <div className={"card item-card child-bg-color"}>
            {/* <div className="float-left"> */}
            <div className="d-flex">
               {/* <span
                  className={classnames(
                     "custom-control custom-checkbox packed-checkbox-container",
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
                  <label
                     className="custom-control-label"
                     htmlFor={"packed-checkbox-" + item.index}
                  ></label>
               </span> */}
               {item.isPacked && (
                  <span
                     className={
                        "icon clickable item-card-icon item-icon-colors-" +
                        String(item.level % LEVEL_COLORS)
                     }
                  >
                     <PackedIcon />
                  </span>
               )}
               {!item.isPacked && item.numPackedChildren >= item.numChildren && (
                  <span
                     className={
                        "icon clickable item-card-icon item-icon-colors-" +
                        String(item.level % LEVEL_COLORS)
                     }
                  >
                     <ReadyToPackIcon />
                  </span>
               )}
               {!item.isPacked && item.numPackedChildren < item.numChildren && (
                  <span
                     className={
                        "icon icon-disabled item-card-icon item-icon-colors-" +
                        String(item.level % LEVEL_COLORS)
                     }
                  >
                     <NotReadyToPackIcon />
                  </span>
               )}

               <span
                  className={
                     "flex-fill item-card-text level-text-color-" +
                     String(item.level % LEVEL_COLORS)
                  }
               >
                  <span className="clickable">&nbsp;&nbsp;{item.name}</span>
               </span>
               {item.hasOwnProperty("items") && (
                  <>
                     <span
                        onClick={(e) => {
                           !item.isPacked &&
                              this.movePageToDifferentItem(
                                 this.props.currentLoadout.itemIndexPath.concat(
                                    [item.index]
                                 )
                              ); // move to current path with the subitem index added on
                        }}
                        className={classnames(
                           "button navigation-link item-card-text level-text-color-" +
                              String((item.level + 1) % LEVEL_COLORS),
                           { disabled: item.isPacked }
                        )}
                     >
                        {item.contentSummaryText}&nbsp;&nbsp;
                     </span>

                     {/* <span className="icon right">
                        <IconArrowThinRightCircle />
                     </span> */}
                     {item.isPacked && (
                        <span
                           className={
                              "icon disabled item-card-icon item-icon-colors-" +
                              String(item.level % LEVEL_COLORS)
                           }
                        >
                           <ChildrenPackedIcon />
                        </span>
                     )}
                     {!item.isPacked &&
                        item.numPackedChildren >= item.numChildren && (
                           <span
                              onClick={(e) => {
                                 this.movePageToDifferentItem(
                                    this.props.currentLoadout.itemIndexPath.concat(
                                       [item.index]
                                    )
                                 ); // move to current path with the subitem index added on
                              }}
                              className={
                                 "icon clickable item-card-icon item-icon-colors-" +
                                 String(item.level % LEVEL_COLORS)
                              }
                           >
                              <ChildrenPackedIcon />
                           </span>
                        )}
                     {!item.isPacked &&
                        item.numPackedChildren < item.numChildren && (
                           <span
                              onClick={(e) => {
                                 this.movePageToDifferentItem(
                                    this.props.currentLoadout.itemIndexPath.concat(
                                       [item.index]
                                    )
                                 ); // move to current path with the subitem index added on
                              }}
                              className={
                                 "icon clickable item-card-icon item-icon-colors-" +
                                 String(item.level % LEVEL_COLORS)
                              }
                           >
                              <ChildrenUnpackedIcon />
                           </span>
                        )}
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
