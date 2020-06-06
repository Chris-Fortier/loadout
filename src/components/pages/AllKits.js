import React from "react";
import AppTemplate from "../ui/AppTemplate";
// import { Link } from "react-router-dom"; // a React element for linking
import { gear } from "../../data/gear";
import Kit from "../ui/Kit";
import orderBy from "lodash/orderBy";

console.log(gear);
export default class AllKits extends React.Component {
   constructor() {
      super(); // boilerplate line that needs to be in the constructor
      console.log(gear);

      // initialize state inside the constructor via this.state = {key: value, key: value,};
      // set default state values for each component
      // define a component's initial state
      this.state = {
         // isFavoritesChecked: false,
         allKits: orderBy(gear, "kitName", "desc"),
         // displayedFuncs: orderBy(uiData, "order", "desc"),
         // orderBy: '["order", "desc"]',
      };

      // this.methodName = this.methodName.bind(this) // example boilerplate to bind this for each method
   }

   // methods happen here, such as what happens when you click on a button

   render() {
      return (
         <AppTemplate>
            <h4>My Kits</h4>

            {/* renders each kit */}
            {this.state.allKits.map((kit) => {
               // const { kitName, numItems, packedItems } = kit;
               console.log(kit.kitName);
               return <Kit key={kit.kitName} kitData={kit} />;
            })}
         </AppTemplate>
      );
   }
}
