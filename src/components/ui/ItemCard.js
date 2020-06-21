import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
import actions from "../../store/actions";
import { LEVEL_COLORS } from "../../utils/helpers";
import classnames from "classnames";
import { IconArrowThinRightCircle } from "../../icons/icons.js";

class ItemCard extends React.Component {
   // move page to a different item
   movePageToDifferentItem(itemIndexPath) {
      this.props.dispatch({
         type: actions.CHANGE_ITEM_INDEX_PATH,
         payload: itemIndexPath,
      });

      // this.setCurrentItem(itemIndexPath);

      // this.setState({ isEditMode: false, isShowingUnpackConfirmation: false }); // get out of edit mode if the current item changes
      // this.props.history.push("/gear");

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
         <div
            className={
               "card item-card level-color-" + String(item.level % LEVEL_COLORS)
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
                           this.props.currentLoadout.itemIndexPath.concat([
                              item.index,
                           ])
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
}

// maps the store to props
function mapStateToProps(state) {
   return {
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(ItemCard); // this is "currying"
