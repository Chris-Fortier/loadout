import React from "react";
import Header from "../ui/Header";
import { connect } from "react-redux";
import UserLoadoutSettings from "../ui/UserLoadoutSettings";
import { IconArrowThinLeftCircle, IconTrash } from "../../icons/icons.js";
import { Link } from "react-router-dom"; // a React element for linking

class LoadoutSharing extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // set default state values

      this.state = {};
   }

   render() {
      console.log("Rendering page...");

      return (
         <div>
            <Header />
            <div className="item-list parent-color-0">
               <div className="container-fluid item-cards-container scroll-fix">
                  <div className="row">
                     <div className="col">
                        <Link
                           className="up-level navigation-link"
                           to="/loadout"
                        >
                           <div className="icon left">
                              <IconArrowThinLeftCircle />
                           </div>
                           Back to Loadout
                        </Link>
                        <div className="">
                           <div className="">
                              <div className="row">
                                 <>
                                    <div className="col">
                                       <h4>
                                          One-Night Camping Trip
                                          <br />
                                          Sharing Settings
                                       </h4>
                                       <table class="table">
                                          <thead>
                                             <tr>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Shared with Email
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Can Edit
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Can Pack
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Admin
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Delete
                                                </th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             <UserLoadoutSettings id="1" />
                                             <UserLoadoutSettings id="2" />
                                             <UserLoadoutSettings id="3" />
                                             <tr>
                                                <th scope="row">
                                                   <input
                                                      type="email"
                                                      className="edit-name"
                                                      id="exampleInputEmail1"
                                                      aria-describedby="emailHelp"
                                                      placeholder="Enter email"
                                                   />
                                                </th>
                                                <td>
                                                   <div class="custom-control custom-checkbox">
                                                      <input
                                                         type="checkbox"
                                                         class="custom-control-input"
                                                         id={
                                                            "can-edit-switch-" +
                                                            this.props.id
                                                         }
                                                      />
                                                      <label
                                                         class="custom-control-label"
                                                         for={
                                                            "can-edit-switch-" +
                                                            this.props.id
                                                         }
                                                      ></label>
                                                   </div>
                                                </td>
                                                <td>
                                                   <div class="custom-control custom-checkbox">
                                                      <input
                                                         type="checkbox"
                                                         class="custom-control-input"
                                                         id={
                                                            "can-pack-switch-" +
                                                            this.props.id
                                                         }
                                                      />
                                                      <label
                                                         class="custom-control-label"
                                                         for={
                                                            "can-pack-switch-" +
                                                            this.props.id
                                                         }
                                                      ></label>
                                                   </div>
                                                </td>
                                                <td>
                                                   <div class="custom-control custom-checkbox">
                                                      <input
                                                         type="checkbox"
                                                         class="custom-control-input"
                                                         id={
                                                            "admin-switch-" +
                                                            this.props.id
                                                         }
                                                      />
                                                      <label
                                                         class="custom-control-label"
                                                         for={
                                                            "admin-switch-" +
                                                            this.props.id
                                                         }
                                                      ></label>
                                                   </div>
                                                </td>
                                                <td>
                                                   <button
                                                      className="icon-clickable icon"
                                                      id={
                                                         "delete-shared-user-" +
                                                         1
                                                      }
                                                   >
                                                      <IconTrash />
                                                   </button>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>{" "}
                                    </div>
                                 </>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
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

export default connect(mapStateToProps)(LoadoutSharing); // this is "currying"
