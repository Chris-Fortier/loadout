import React from "react";
// import landingLogo from "../../img/logo-landing.png"; // thumbs up icon
import { Link } from "react-router-dom"; // a React element for linking

// export default function Landing() {
export default class Landing extends React.Component {
   constructor() {
      super(); // boilerplate line that needs to be in the constructor

      // initialize state inside the constructor via this.state = {key: value, key: value,};
      // set default state values for each component
      // define a component's initial state
      this.state = {
         landingMode: "log-in", // set to either "log-in" or "new-account"
      };
   }

   setNewAccountMode() {
      this.setState({ landingMode: "new-account" });
   }

   setLogInMode() {
      this.setState({ landingMode: "log-in" });
   }

   renderLogInCard() {
      return (
         <div className="card mb-3">
            <div className="card-body">
               <h5 className="card-title">Log In</h5>
               <form className="mb-0 needs-validation" noValidate>
                  <div className="form-group">
                     {/* <label htmlFor="existing-username-input">
            Username
         </label> */}
                     <input
                        className="form-control"
                        id="existing-username-input"
                        placeholder="username"
                        required
                     />
                     <div className="text-danger" id="existing-username-error">
                        username error
                     </div>
                  </div>
                  <div className="form-group">
                     {/* <label htmlFor="existing-password-input">
            Password
         </label> */}
                     <input
                        type="password"
                        className="form-control"
                        id="existing-password-input"
                        placeholder="password"
                        required
                     />
                     <div className="text-danger" id="existing-password-error">
                        password error
                     </div>
                  </div>
                  <Link
                     className="btn btn-primary btn-block my-3"
                     id="login-button"
                     to="/kits"
                  >
                     Log in
                  </Link>
                  <button
                     className="btn btn-secondary btn-sm btn-block"
                     id="new-account-button"
                     onClick={() => this.setNewAccountMode()}
                  >
                     Sign Up
                  </button>
               </form>
            </div>
         </div>
      );
   }

   renderNewAccountCard() {
      return (
         <div className="card mb-3">
            <div className="card-body">
               <h5 className="card-title">Make New Account</h5>
               <form className="mb-0 needs-validation" noValidate>
                  <div className="form-group">
                     {/* <label htmlFor="new-username-input">
               Username
            </label> */}
                     <input
                        className="form-control"
                        id="new-username-input"
                        placeholder="make a username"
                        required
                     />
                     <div className="text-danger" id="new-username-error">
                        username error
                     </div>
                  </div>
                  <div className="form-group">
                     {/* <label htmlFor="new-password-input">
               Password
            </label> */}
                     <input
                        type="password"
                        className="form-control"
                        id="new-password-input"
                        placeholder="make a password"
                        required
                     />
                     <div className="text-danger" id="new-password-error">
                        password doesn't meet requirements
                     </div>
                     <input
                        type="password"
                        className="form-control"
                        id="new-repeat-password-input"
                        placeholder="repeat your password"
                        required
                     />
                     <div className="text-danger" id="new-password-error">
                        passwords don't match
                     </div>
                  </div>
                  <Link
                     className="btn btn-primary btn-block my-3"
                     id="login-button"
                     to="/kits"
                  >
                     Complete New Account
                  </Link>
                  <button
                     className="btn btn-secondary btn-sm btn-block"
                     id="new-account-button"
                     onClick={() => this.setLogInMode()}
                  >
                     Already Have an Account
                  </button>
               </form>
            </div>
         </div>
      );
   }

   render() {
      return (
         <div className="background-image">
            <div className="container-fluid landing-page">
               <div className="row">
                  <div className="col-12 offset-sm-2 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                     <div className="">
                        <h1 className="mt-5 text-white">Loadout</h1>
                     </div>
                     {/* render either the log-in or new account cards depending on landingMode */}
                     {this.state.landingMode === "log-in" &&
                        this.renderLogInCard()}
                     {this.state.landingMode === "new-account" &&
                        this.renderNewAccountCard()}
                  </div>
               </div>
            </div>
         </div>
      );
   }
}
