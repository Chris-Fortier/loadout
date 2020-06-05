import React from "react";
// import landingLogo from "../../img/logo-landing.png"; // thumbs up icon
import { Link } from "react-router-dom"; // a React element for linking

export default function Landing() {
   return (
      <div className="background-image">
         <div className="container-fluid landing-page">
            <div className="row">
               <div className="col-12 offset-sm-2 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                  <div className="">
                     <h1 className="mt-5 text-white">Loadout</h1>
                  </div>
                  <div className="card">
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
                              <div
                                 className="text-danger"
                                 id="existing-username-error"
                              >
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
                              <div
                                 className="text-danger"
                                 id="existing-password-error"
                              >
                                 password error
                              </div>
                           </div>
                           <Link
                              className="btn btn-primary btn-block my-3"
                              id="login-button"
                              to="/all-kits"
                           >
                              Log in
                           </Link>
                           <Link
                              className="btn btn-secondary btn-sm btn-block"
                              id="new-account-button"
                              to="/all-kits"
                           >
                              Make New Account
                           </Link>
                        </form>
                     </div>
                  </div>

                  <div className="card d-none">
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
                              <div
                                 className="text-danger"
                                 id="new-username-error"
                              >
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
                              <input
                                 type="password"
                                 className="form-control"
                                 id="new-repeat-password-input"
                                 placeholder="repeat your password"
                                 required
                              />
                              <div
                                 className="text-danger"
                                 id="new-password-error"
                              >
                                 password error
                              </div>
                           </div>
                           <Link
                              className="btn btn-primary btn-block my-3"
                              id="login-button"
                              to="/all-kits"
                           >
                              Submit New Account
                           </Link>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
