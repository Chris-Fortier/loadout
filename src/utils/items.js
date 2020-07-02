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
