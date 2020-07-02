import { processAllItems } from "./processItems";

// this file will store functions relating to changing items in the loadouts

// returns the item object from an itemIndexPath
export function getItemFromPath(gear, itemIndexPath) {
   let copyOfGear = gear;
   let currentItem = copyOfGear;
   for (let i in itemIndexPath) {
      currentItem = currentItem.items[itemIndexPath[i]]; // go one lever deeper for each index in itemIndexPath
   }
   return currentItem;
}

// returns the parent item object from an itemIndexPath
export function getParentItemFromPath(gear, itemIndexPath) {
   let copyOfGear = gear;
   let parentItem = copyOfGear;
   for (let i = 0; i < itemIndexPath.length - 1; i++) {
      parentItem = parentItem.items[itemIndexPath[i]]; // go one lever deeper for each index in itemIndexPath
   }
   return parentItem;
}

// updates the name of an item
export function renameItem(gear, itemIndexPath, newName) {
   // console.log("rename " + this.props.item.name + " to " + newName);

   // console.log("itemIndexPath:", itemIndexPath);

   // get the actual item I want to change based on the index path
   const currentItem = getItemFromPath(gear, itemIndexPath);

   // meat of what this funtion does
   currentItem.name = newName;

   // this must happen whenever something in the loadout changes
   processAllItems(gear);
}
