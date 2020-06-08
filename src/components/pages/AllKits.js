import React from "react";
import AppTemplate from "../ui/AppTemplate";
// import { Link } from "react-router-dom"; // a React element for linking
import { gear } from "../../data/gear";
import Item from "../ui/Item";
import orderBy from "lodash/orderBy";

export default class AllKits extends React.Component {
   constructor() {
      super(); // boilerplate line that needs to be in the constructor

      // initialize state inside the constructor via this.state = {key: value, key: value,};
      // set default state values for each component
      // define a component's initial state
      this.state = {
         // isFavoritesChecked: false,
         allKits: orderBy(gear, "name", "asc"),
         // displayedFuncs: orderBy(uiData, "order", "desc"),
         // orderBy: '["order", "desc"]',
      };

      // this.methodName = this.methodName.bind(this) // example boilerplate to bind this for each method
   }

   // methods happen here, such as what happens when you click on a button

   render() {
      // console.log(Item.renderContainingItems());
      return (
         <AppTemplate>
            <h4>My Kits</h4>

            {/* renders each top-level item (kit) */}
            {/* {this.state.allKits.map((item) => {
               return <Item key={item.name} itemData={item} />;
            })} */}
            {/* put directly in a row as a quick hack to get it closer to the sides of the screen */}
            <div className="row">
               <Item key={"sdfs"} itemData={gear} itemLevel={0} />
            </div>
            {/* {Item.renderContainingItems(gear)} */}
         </AppTemplate>
      );
   }
}
