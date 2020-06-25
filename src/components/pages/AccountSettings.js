import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom"; // a React element for linking

class AccountSettings extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // set default state values
      this.state = {};
   }

   // methods happen here, such as what happens when you click on a button

   render() {
      console.log("Rendering page...");

      return (
         <div className="item-list account-settings">
            <div className="container-fluid item-cards-container scroll-fix">
               <div className="row">
                  <div className="col">
                     <h5>Loadout Account Settings</h5>
                  </div>
               </div>
               <div className="row">
                  <div className="col">
                     <p>name@gmail.com</p>
                  </div>
               </div>
               <div className="row">
                  <div className="col">
                     <Link
                        to="/loadout-list"
                        className="btn btn-link float-right"
                     >
                        Done
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {};
}

export default connect(mapStateToProps)(AccountSettings); // this is "currying"
