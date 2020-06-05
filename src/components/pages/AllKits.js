import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom"; // a React element for linking
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
            {/* <Link to="/kit-list">Camera Bag</Link>
         <Link to="/kit-list">Day Pack</Link>
         <Link to="/kit-list">Car Kit</Link> */}

            <Link to="/kit-list" className="card red">
               <div className="card-body green">
                  <div className="row blue">
                     <div className="col-8 blue">Camera Bag</div>
                     <div className="col-4 cyan">5/10</div>
                  </div>
               </div>
            </Link>

            <Link to="/kit-list" className="card red">
               <div className="card-body green">
                  <div className="row blue">
                     <div className="col-8 blue">Day Pack</div>
                     <div className="col-4 cyan">24/33</div>
                  </div>
               </div>
            </Link>

            <Kit />

            {/* {this.state.allKits.map((kit) => {
               const { kitName, numItems, packedItems } = kit;
               return (
                  <Kit
                  key={kitName}
                  kitName={kitName}
                  numItems={numItems}
                  packedItems={packedItems}
                  />
               );
            })} */}

            {this.state.allKits.map((kit) => {
               return <Kit key={kit.kitName} />;
            })}
         </AppTemplate>
      );
   }
}
