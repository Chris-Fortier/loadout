import React from "react";
import { Link } from "react-router-dom"; // a React element for linking

// export default function Header() {
export default class Header extends React.Component {
   constructor() {
      super(); // boilerplate

      // set default state values for each component
      this.state = {
         rollout: "none", // which rollout is active, either "Loadout", "Account" or "none"
      };
   }

   toggleLoadoutRollout() {
      if (this.state.rollout !== "Loadout") {
         this.setState({ rollout: "Loadout" });
      } else {
         this.setState({ rollout: "none" });
      }
      console.log(this.state);
   }

   toggleAccountRollout() {
      if (this.state.rollout !== "Account") {
         this.setState({ rollout: "Account" });
      } else {
         this.setState({ rollout: "none" });
      }
      console.log(this.state);
   }

   // renders the Loadout rollout menu
   renderLoadoutRollout() {
      return (
         <>
            <div className="row">
               <div className="col">
                  <button to="" className="btn btn-link">
                     About Loadout
                  </button>
               </div>
            </div>
         </>
      );
   }

   // renders the Account rollout menu
   renderAccountRollout() {
      return (
         <>
            {/* <div className="row">
               <div className="col">
                  <p className="float-right">username12345</p>
               </div>
            </div> */}
            <div className="row">
               <div className="col">
                  <p className="float-right">name@gmail.com</p>
               </div>
            </div>
            <div className="row">
               <div className="col">
                  <button className="btn btn-link float-right">
                     Account Settings
                  </button>
               </div>
            </div>
            <div className="row">
               <div className="col">
                  <Link to="/" className="btn btn-link float-right">
                     Log Out
                  </Link>
               </div>
            </div>
         </>
      );
   }

   // // renders a rollout for either Loadout or About, its a wrapper for both
   // renderRollout() {
   //    return (
   //       // <div className="row">
   //       //    <div className="col">
   //       <>
   //          {this.state.rollout === "Loadout" && this.renderLoadoutRollout()}
   //          {this.state.rollout === "Account" && this.renderAccountRollout()}
   //       </>
   //       //    </div>
   //       // </div>
   //    );
   // }

   render() {
      return (
         <div className="page-header">
            <div className="row">
               <div className="col">
                  <button
                     onClick={() => this.toggleLoadoutRollout()}
                     className="btn btn-link"
                  >
                     Loadout
                  </button>
                  <button
                     onClick={() => this.toggleAccountRollout()}
                     className="btn btn-link float-right"
                  >
                     Account
                  </button>
               </div>
            </div>
            {this.state.rollout === "Loadout" && this.renderLoadoutRollout()}
            {this.state.rollout === "Account" && this.renderAccountRollout()}
         </div>
      );
   }
}
