import React from "react";
import { connect } from "react-redux";
// import actions from "../../store/actions";
import {
   MOVE_UPDOWN,
   MAX_ITEM_NAME_LENGTH,
   LEVEL_COLORS,
} from "../../utils/helpers";
// import classnames from "classnames";
import {
   // IconArrowThinRightCircle,
   IconTrash,
   IconChevronDown,
   IconChevronUp,
} from "../../icons/icons.js";

class ItemCardEdit extends React.Component {
   // updates the displayed name field of one of the current item's subitems
   renameItem(e) {
      console.log("rename " + this.props.item.name + " to " + e.target.value);
   }

   // deletes an item
   deleteItem() {
      if (this.props.item.numDescendants > 0) {
         console.log(
            "Are you sure you want to delete " +
               this.props.item.name +
               " and its " +
               this.props.item.numDescendants +
               " subitems?"
         );
      } else {
         console.log("deleting " + this.props.item.name);
      }
   }

   render() {
      return (
         <div
            className={
               "card item-card level-color-" +
               String((this.props.item.level + 1) % LEVEL_COLORS)
            }
         >
            <div className="d-flex">
               <span className="flex-fill">
                  <input
                     className="edit-name"
                     id={"edit-name-input-" + this.props.item.index}
                     defaultValue={this.props.item.name}
                     onChange={(e) => this.renameItem(e)}
                     maxLength={MAX_ITEM_NAME_LENGTH}
                  />
               </span>
               <button
                  className="icon-clickable item-card-icon"
                  id={"delete-item-" + this.props.item.index}
                  onClick={() => this.deleteItem(this.props.item.index)}
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
}

// maps the store to props
function mapStateToProps(state) {
   return {
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(ItemCardEdit); // this is "currying"
