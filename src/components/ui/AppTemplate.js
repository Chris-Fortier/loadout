import React from "react";
import Header from "./Header";
// import Navigation from "./Navigation";

export default function AppTemplate(props) {
   return (
      <div className="color0">
         <div className="container">
            <div className="row">
               <div className="col-12 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">
                  <Header />
                  {/* <Navigation /> */}
                  {
                     props.children // this renders the content that is inside of this template
                  }
               </div>
            </div>
         </div>
      </div>
   );
}
