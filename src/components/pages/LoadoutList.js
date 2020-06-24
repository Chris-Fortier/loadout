import React from "react";
import Header from "../ui/Header";
// import orderBy from "lodash/orderBy";
// import { IconArrowThinLeftCircle } from "../../icons/icons.js";
// import { MAX_ITEM_NAME_LENGTH, LEVEL_COLORS } from "../../utils/helpers";
// import axios from "axios";
import { connect } from "react-redux";
// import actions from "../../store/actions";
import LoadoutCard from "../ui/LoadoutCard";
// import ItemCardEdit from "../ui/ItemCardEdit";

// mock data to display
const loadouts = [
   {
      id: "42655170-7e10-4431-8d98-c2774f6414a4",
      name: "One-Night Camping Trip",
      createdAt: 1592939977877, // when the loadout was created
      lastEditAt: 1592940077877, // the last time something was changed (item renamed, added, deleted)
      lastPackAt: 1592940177877, // the last time something was packed or unpacked
      creator: "84fbbb78-b2a2-11ea-b3de-0242ac130004", // the user who created the loadout
   },
   {
      id: "e0364b00-f7fc-469c-ab82-8de3487bcc0b",
      name: "Day at Punchcode",
      createdAt: 1592940277877, // when the loadout was created
      lastEditAt: 1592940377877, // the last time something was changed (item renamed, added, deleted)
      lastPackAt: 1592940477877, // the last time something was packed or unpacked
      creator: "84fbbb78-b2a2-11ea-b3de-0242ac130004", // the user who created the loadout
   },
];

class LoadoutList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // set default state values
      this.state = {};
   }

   // methods happen here, such as what happens when you click on a button

   render() {
      console.log("Rendering page...");

      return (
         <div>
            <Header />
            <div className="item-list parent-color-0">
               <div className="container-fluid item-cards-container scroll-fix">
                  <div className="row">
                     <div className="col">
                        <div className="">
                           <div className="">
                              <div className="row">
                                 <>
                                    <div className="col">
                                       <h4>Loadouts</h4>
                                    </div>
                                 </>
                              </div>
                           </div>
                           <div className="">
                              <div className="row">
                                 <div className="col">
                                    {/* One-Night Camping Trip */}
                                    {loadouts.map((loadout) => (
                                       <LoadoutCard
                                          loadout={loadout}
                                          key={loadout.id}
                                       />
                                    ))}
                                 </div>
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

export default connect(mapStateToProps)(LoadoutList); // this is "currying"
