import React from "react";
// import utils from "../utils/utils";
// import { convertDataType } from "../utils/helpers";
import { Link } from "react-router-dom"; // a React element for linking
// import orderBy from "lodash/orderBy";
// import { toKebabCase } from "../../utils/helpers";

export default class ItemCard extends React.Component {
   render() {
      // extra js can go here

      // this is to simplify code below
      const itemData = this.props.itemData;

      let expander = null;

      // do this if this item has subitems
      if (itemData.hasOwnProperty("items")) {
         const numItems = itemData.items.length;

         // find the number of packed items by counting how many have packed set to true
         const numPackedItems = itemData.items.reduce((numPacked, item) => {
            if (item.isPacked) {
               return (numPacked += 1);
            } else {
               return numPacked;
            }
         }, 0);

         // console.log("hello", toKebabCase(itemData.name));

         // a used so I can make the link relative to the full path
         expander = (
            <Link
               to={window.location.pathname + "-" + this.props.itemIndex}
               className="float-right packed-counter"
            >
               {numPackedItems} / {numItems}
            </Link>
         );
      }

      return (
         <div
            className={
               "card item-card color" + String(this.props.itemLevel % 3)
            }
         >
            {/* <div className="card-header"> */}
            <div className="float-left">
               <div className="custom-control custom-checkbox">
                  <input
                     className="custom-control-input"
                     type="checkbox"
                     id="packed-checkbox"
                     value="option1"
                     checked={itemData.isPacked}
                  />
                  <label
                     className="custom-control-label"
                     htmlFor="packed-checkbox"
                  >
                     {itemData.name}
                  </label>
                  {expander}
               </div>
            </div>
            {/* </div> */}
         </div>
      );
   }
}
