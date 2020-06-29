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
import { processAllItems } from "../../utils/processItems";

class ItemCardEdit extends React.Component {
   // updates the displayed name field of one of the current item's subitems
   renameItem(e, itemIndexPath) {
      console.log("rename " + this.props.item.name + " to " + e.target.value);

      // copyOfGear.lastChange = "test hello";
      console.log("itemIndexPath:", itemIndexPath);

      // get the actual item I want to change based on the index path
      // TODO duplicated in other functions
      let copyOfGear = this.props.currentLoadout.gear;
      let currentItem = copyOfGear;
      for (let i in itemIndexPath) {
         currentItem = currentItem.items[itemIndexPath[i]]; // go one lever deeper for each index in itemIndexPath
      }
      console.log("name of target item:", currentItem.name);

      // meet of what this funtion does
      currentItem.name = e.target.value;

      // put the data back into the store
      // this.props.dispatch({
      //    type: actions.STORE_CURRENT_LOADOUT,
      //    payload: copyOfGear,
      // });

      // this must happen whenever something in the loadout changes
      processAllItems(this.props.currentLoadout.gear);
   }

   // deletes an item
   deleteItem(itemIndexPath) {
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

      console.log("itemIndexPath:", itemIndexPath);

      // get the parent item because that is the item that's items I want to delete from
      let copyOfGear = this.props.currentLoadout.gear;
      let parentItem = copyOfGear;
      for (let i = 0; i < itemIndexPath.length - 1; i++) {
         parentItem = parentItem.items[itemIndexPath[i]]; // go one lever deeper for each index in itemIndexPath
      }
      const itemIndex = itemIndexPath[itemIndexPath.length - 1];
      console.log("name of parent item:", parentItem.name);

      // meet of what this funtion does
      parentItem.items.splice(itemIndex, 1); // delete the item

      // this must happen whenever something in the loadout changes
      processAllItems(this.props.currentLoadout.gear);
   }

   render() {
      const item = this.props.item; // this is to simplify code below

      let thisItemPath = this.props.currentLoadout.itemIndexPath.concat([
         item.index,
      ]); // stores the complete index path to the item referred to on this item card

      return (
         <div
            className={
               "card item-card-edit child-color-" +
               String(item.level % LEVEL_COLORS)
            }
         >
            <div className="d-flex">
               <span className="flex-fill">
                  <input
                     className="edit-name"
                     id={"edit-name-input-" + item.index}
                     defaultValue={item.name}
                     onChange={(e) => this.renameItem(e, thisItemPath)}
                     maxLength={MAX_ITEM_NAME_LENGTH}
                  />
               </span>
               <button
                  className="clickable icon-dark"
                  id={"delete-item-" + item.index}
                  onClick={() => this.deleteItem(thisItemPath)}
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
