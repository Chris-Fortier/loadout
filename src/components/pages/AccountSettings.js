import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { EMAIL_REGEX } from "../../utils/helpers";
import { v4 as getUuid } from "uuid";
import hash from "object-hash";
import classnames from "classnames";
import {
   IconUserAdd,
   // IconUserCheck,
   // IconKey,
   // IconHome,
   // IconEdit,
} from "../../icons/icons.js";
import { withRouter } from "react-router-dom"; // a React element for linking
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";

class AccountSettings extends React.Component {
   constructor() {
      super(); // boilerplate line that needs to be in the constructor

      // initialize state inside the constructor via this.state = {key: value, key: value,};
      // set default state values for each component
      // define a component's initial state
      this.state = {
         hasEmailRollout: false,
         hasPasswordRollout: false,
         hasDeleteRollout: false,
      };
   }

   toggleEmailRollout() {
      console.log("toggleEmailRollout()...");
      this.setState({ hasEmailRollout: !this.state.hasEmailRollout });
   }

   togglePasswordRollout() {
      console.log("togglePasswordRollout()...");
      this.setState({ hasPasswordRollout: !this.state.hasPasswordRollout });
   }

   toggleDeleteRollout() {
      console.log("toggleDeleteRollout()...");
      this.setState({ hasDeleteRollout: !this.state.hasDeleteRollout });
   }

   render() {
      return (
         <div className="background-image">
            <div className="container-fluid landing-page">
               <div className="row">
                  <div
                     style={{ width: "max(calc((100% - 320px)*.33),15px)" }}
                  ></div>
                  <div
                     style={{
                        width: "min(320px,(100% - 30px))",
                        marginBottom: "50px",
                     }}
                  >
                     <h1 className="mt-5 text-white">Account Settings</h1>
                     <div className="card mb-3">
                        <div className="card-body">
                           <h5>chris@gmail.com</h5>
                           <form className="mb-0 needs-validation" noValidate>
                              <div className="form-group">
                                 <input
                                    id="existing-email-input"
                                    placeholder="Enter Your Email"
                                    required
                                    type="email"
                                    className={classnames({
                                       "form-control": true,
                                       "is-invalid": this.state
                                          .hasExistingEmailError,
                                    })}
                                 />
                                 {this.state.hasExistingEmailError && (
                                    <div className="text-danger">
                                       {this.state.existingEmailError}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group">
                                 <input
                                    type="password"
                                    id="existing-password-input"
                                    placeholder="Enter Your Password"
                                    required
                                    className={classnames({
                                       "form-control": true,
                                       "is-invalid": this.state
                                          .hasExistingPasswordError,
                                    })}
                                 />
                                 {this.state.hasExistingPasswordError && (
                                    <div
                                       className="text-danger"
                                       id="password-error"
                                    >
                                       {this.state.existingPasswordError}
                                    </div>
                                 )}
                              </div>
                              <button
                                 className="btn btn-primary btn-block my-3"
                                 type="button"
                                 onClick={() => this.validateLogInAttempt()}
                              >
                                 Log In
                              </button>
                              <div class="btn-group d-flex" role="group">
                                 <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => this.setNewAccountMode()}
                                 >
                                    Make a new account
                                 </button>
                                 <button
                                    type="button"
                                    className="btn btn-secondary btn-sm tab-separator"
                                    onClick={() => this.bypassLogIn()}
                                 >
                                    Bypass
                                 </button>
                              </div>
                           </form>
                           <button className="rollout-button">
                              Delete Your Account
                           </button>
                           <p>
                              Deleting this account will delete all your
                              loadouts that are not shared with anyone else.
                           </p>
                           <div className="card-section">
                              <div
                                 className="button navigation-link"
                                 onClick={() => this.toggleEmailRollout()}
                              >
                                 Change Your Email
                              </div>
                              {this.state.hasEmailRollout && (
                                 <>
                                    <p>Enter your new email address.</p>
                                    <input value="chris@gmail.com" />
                                    <div className="button primary-action-button">
                                       Confirm Email Change
                                    </div>
                                 </>
                              )}
                           </div>
                           <div
                              className="button rollout-button"
                              onClick={() => this.toggleDeleteRollout()}
                           >
                              Delete Your Account
                              {this.state.hasDeleteRollout && (
                                 <>
                                    <p>
                                       Deleting this account will also delete
                                       all the loadouts that are not shared with
                                       anyone else.
                                    </p>
                                    <div className="button primary-action-button">
                                       Confirm Account Delete
                                    </div>
                                 </>
                              )}
                           </div>
                           <div className="button rollout-button disabled">
                              Delete Your Account
                           </div>
                           <div className="button navigation-link">
                              Back to Loadouts
                           </div>
                           <div className="button navigation-link disabled">
                              Back to Loadouts
                           </div>
                           <div className="button primary-action-button">
                              Log Out
                           </div>
                           <div className="button primary-action-button disabled">
                              Log Out
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
   return {};
}

export default withRouter(connect(mapStateToProps)(AccountSettings)); // this is "currying"
