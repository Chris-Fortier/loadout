import React from "react";
import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
// import actions from "../../store/actions";
// import { LEVEL_COLORS } from "../../utils/helpers";
// import classnames from "classnames";
// import { IconArrowThinRightCircle } from "../../icons/icons.js";

class LoadoutCard extends React.Component {
   render() {
      console.log("props", this.props);
      const loadout = this.props.loadout; // this is to simplify code below

      return (
         <Link className={"card item-card child-bg-color"} to="/loadout">
            <div className="d-flex">
               <span className="flex-fill level-text-color-1">
                  {loadout.loadoutName}
                  {loadout.canEdit === 1 && <>&nbsp;E</>}
                  {loadout.canPack === 1 && <>&nbsp;P</>}
                  {loadout.isAdmin === 1 && <>&nbsp;A</>}
               </span>
            </div>
         </Link>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {};
}

export default connect(mapStateToProps)(LoadoutCard); // this is "currying"
