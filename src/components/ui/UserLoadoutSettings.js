import React from "react";
import { connect } from "react-redux";
import {
   // IconArrowThinRightCircle,
   IconTrash,
} from "../../icons/icons.js";

class UserLoadoutSettings extends React.Component {
   render() {
      return (
         <tr>
            <th scope="row">mike@gmail.com</th>
            <td>
               <div class="custom-control custom-checkbox">
                  <input
                     type="checkbox"
                     class="custom-control-input"
                     id={"can-edit-switch-" + this.props.id}
                  />
                  <label
                     class="custom-control-label"
                     for={"can-edit-switch-" + this.props.id}
                  ></label>
               </div>
            </td>
            <td>
               <div class="custom-control custom-checkbox">
                  <input
                     type="checkbox"
                     class="custom-control-input"
                     id={"can-pack-switch-" + this.props.id}
                  />
                  <label
                     class="custom-control-label"
                     for={"can-pack-switch-" + this.props.id}
                  ></label>
               </div>
            </td>
            <td>
               <div class="custom-control custom-checkbox">
                  <input
                     type="checkbox"
                     class="custom-control-input"
                     id={"admin-switch-" + this.props.id}
                  />
                  <label
                     class="custom-control-label"
                     for={"admin-switch-" + this.props.id}
                  ></label>
               </div>
            </td>
            <td>
               <button
                  className="clickable icon"
                  id={"delete-shared-user-" + 1}
               >
                  <IconTrash />
               </button>
            </td>
         </tr>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(UserLoadoutSettings); // this is "currying"
