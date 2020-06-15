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

// export default function Landing() {
export default class Landing extends React.Component {
   constructor() {
      super(); // boilerplate line that needs to be in the constructor

      // initialize state inside the constructor via this.state = {key: value, key: value,};
      // set default state values for each component
      // define a component's initial state
      this.state = {
         landingMode: "log-in", // set to either "log-in" or "new-account"

         // sign up
         newEmailError: "",
         newPasswordError: "",
         hasNewEmailError: false,
         hasNewPasswordError: false,

         // log in
         existingEmailError: "",
         existingPasswordError: "",
         hasExistingEmailError: false,
         hasExistingPasswordError: false,
      };
   }

   setNewAccountMode() {
      this.setState({
         landingMode: "new-account",
         newEmailError: "",
         newPasswordError: "",
         hasNewEmailError: false,
         hasNewPasswordError: false,
      });
   }

   setLogInMode() {
      this.setState({
         landingMode: "log-in",
         existingEmailError: "",
         existingPasswordError: "",
         hasExistingEmailError: false,
         hasExistingPasswordError: false,
      });
   }

   // tests if the sign up email is valid
   async setNewEmailState(emailInput) {
      console.log("setNewEmailState()...");
      const lowerCasedEmailInput = emailInput.toLowerCase();

      if (emailInput === "")
         this.setState({
            newEmailError: "Please enter your email address.",
            hasNewEmailError: true,
         });
      else if (!EMAIL_REGEX.test(lowerCasedEmailInput)) {
         this.setState({
            newEmailError: "Please enter a valid email address.",
            hasNewEmailError: true,
         });
      } else {
         this.setState({ newEmailError: "", hasNewEmailError: false });
      }
   }

   // tests if the sign up email is valid
   async setExistingEmailState(emailInput) {
      console.log("setExistingEmailState()...");
      console.log("emailInput", emailInput);
      const lowerCasedEmailInput = emailInput.toLowerCase();

      if (emailInput === "") {
         console.log("bad existing email");
         this.setState({
            existingEmailError:
               "Please enter the email associated with your account.",
            hasExistingEmailError: true,
         });
      } else if (!EMAIL_REGEX.test(lowerCasedEmailInput)) {
         this.setState({
            existingEmailError: "Please enter a valid email address.",
            hasExistingEmailError: true,
         });
      } else {
         this.setState({
            existingEmailError: "",
            hasExistingEmailError: false,
         });
      }
   }

   // tests if the local part of the email is inside the password
   checkHasLocalPart(passwordInput, emailInput) {
      if (emailInput.length < 4) {
         return false;
      } else {
         const localPart = emailInput.split("@")[0];
         return passwordInput.includes(localPart);
      }
   }

   // checks if a new password is valid
   async setNewPasswordState(passwordInput, emailInput) {
      console.log("setNewPasswordState()...");

      const uniqChars = [...new Set(passwordInput)];

      if (passwordInput === "") {
         // check if password input is blank
         this.setState({
            newPasswordError: "Please create a password.",
            hasNewPasswordError: true,
         });
      } else if (passwordInput.length < 9) {
         // check if password is less than 9 characters
         this.setState({
            newPasswordError: "Your password must be at least 9 characters.",
            hasNewPasswordError: true,
         });
      } else if (this.checkHasLocalPart(passwordInput, emailInput)) {
         // check if the local part of email is in the password
         this.setState({
            newPasswordError:
               "Your password cannot contain your email address.",
            hasNewPasswordError: true,
         });
      } else if (uniqChars.length < 3) {
         // check if the password has less than 3 unique characters
         this.setState({
            newPasswordError:
               "Your password must have at least three unique characters.",
            hasNewPasswordError: true,
         });
      } else {
         this.setState({ newPasswordError: "", hasNewPasswordError: false });
      }
   }

   // checks if an existing email is valid
   async setExistingPasswordState(passwordInput) {
      console.log("setExistingPasswordState()...");
      console.log("passwordInput", passwordInput);

      if (passwordInput === "") {
         // check if password input is blank
         this.setState({
            existingPasswordError: "Please enter your password.",
            hasExistingPasswordError: true,
         });
      } else {
         this.setState({
            existingPasswordError: "",
            hasExistingPasswordError: false,
         });
      }
   }

   // tests if the email and password are valid inputs for logging in
   async validateLogInAttempt() {
      console.log("validateLogInAttempt()...");
      const emailInput = document.getElementById("existing-email-input").value;
      const passwordInput = document.getElementById("existing-password-input")
         .value;

      // await is used on these to make sure we get the states of these before the if statement
      await this.setExistingEmailState(emailInput);
      await this.setExistingPasswordState(passwordInput);

      if (
         !this.state.hasExistingEmailError &&
         !this.state.hasExistingPasswordError
      ) {
         // const user = {
         //    id: getUuid(),
         //    email: emailInput,
         //    password: hash(passwordInput),
         //    createdAt: Date.now(),
         // };
         // console.log("created a new user object", user);

         // redirect the user
         // todo: make this its own function
         this.props.history.push("/gear");
      }
   }

   // tests if the email and password are valid and if so creates the user
   async validateAndCreateUser() {
      console.log("validateAndCreateUser...");
      const emailInput = document.getElementById("new-email-input").value;
      const passwordInput = document.getElementById("new-password-input").value;

      // await is used on these to make sure we get the states of these before the if statement
      await this.setNewEmailState(emailInput);
      await this.setNewPasswordState(passwordInput, emailInput);

      if (!this.state.hasNewEmailError && !this.state.hasNewPasswordError) {
         const user = {
            id: getUuid(),
            email: emailInput,
            password: hash(passwordInput),
            createdAt: Date.now(),
         };
         console.log("created a new user object", user);

         // redirect the user
         // todo: make this its own function
         this.props.history.push("/gear");
      }
   }

   renderLogInCard() {
      return (
         <div className="card mb-3">
            <div className="card-body">
               <h5>Log In</h5>
               <form className="mb-0 needs-validation" noValidate>
                  <div className="form-group">
                     <input
                        id="existing-email-input"
                        placeholder="Enter Your Email"
                        required
                        type="email"
                        className={classnames({
                           "form-control": true,
                           "is-invalid": this.state.hasExistingEmailError,
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
                           "is-invalid": this.state.hasExistingPasswordError,
                        })}
                     />
                     {this.state.hasExistingPasswordError && (
                        <div className="text-danger" id="password-error">
                           {this.state.existingPasswordError}
                        </div>
                     )}
                  </div>
                  <button
                     className="btn btn-primary btn-block my-3"
                     to="/gear-"
                     type="button"
                     onClick={() => this.validateLogInAttempt()}
                  >
                     Log In
                  </button>
                  <button
                     className="btn btn-secondary btn-sm btn-block"
                     onClick={() => this.setNewAccountMode()}
                  >
                     Make a New Account
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
               <h5>Sign Up</h5>
               <p>
                  <span className="icon-container">
                     <IconUserAdd />
                  </span>
                  &nbsp;Make a New Account
               </p>
               <form className="mb-0 needs-validation" noValidate>
                  <div className="form-group">
                     <input
                        id="new-email-input"
                        placeholder="Enter Your Email"
                        required
                        type="email"
                        className={classnames({
                           "form-control": true,
                           "is-invalid": this.state.hasNewEmailError,
                        })}
                     />
                     {this.state.hasNewEmailError && (
                        <div className="text-danger" id="email-error">
                           {this.state.newEmailError}
                        </div>
                     )}
                  </div>
                  <div className="form-group">
                     <input
                        type="password"
                        id="new-password-input"
                        placeholder="Enter a Password"
                        required
                        className={classnames({
                           "form-control": true,
                           "is-invalid": this.state.hasNewPasswordError,
                        })}
                     />
                     {this.state.hasNewPasswordError && (
                        <div className="text-danger" id="password-error">
                           {this.state.newPasswordError}
                        </div>
                     )}
                  </div>
                  <button
                     className="btn btn-primary btn-block my-3"
                     id="login-button"
                     type="button"
                     onClick={() => this.validateAndCreateUser()}
                  >
                     Sign Up
                  </button>
                  <button
                     className="btn btn-secondary btn-sm btn-block"
                     id="new-account-button"
                     onClick={() => this.setLogInMode()}
                  >
                     Use an Existing Account
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
                  <div
                     style={{ width: "max(calc((100% - 320px)*.33),15px)" }}
                  ></div>
                  <div
                     style={{
                        width: "min(320px,(100% - 30px))",
                        marginBottom: "50px",
                     }}
                  >
                     <h1 className="mt-5 text-white">Loadout</h1>
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
