import React from "react";
// import AppTemplate from "../ui/AppTemplate";
// import { Link } from "react-router-dom"; // a React element for linking
import { gear } from "../../data/gear";
// import Item from "../ui/Item";
// import SingleLevel from "../ui/SingleLevel"; // new single level component that only views one level at a time
// import ItemCard from "../ui/ItemCard"; // new single level component that only views one level at a time
import ItemList from "../ui/ItemList"; // new single level component that only views one level at a time
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
      return <ItemList key={"sdfs"} itemData={gear} level={0} />;
   }
}
