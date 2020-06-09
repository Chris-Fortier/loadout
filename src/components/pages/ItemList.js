import React from "react";
// import AppTemplate from "../ui/AppTemplate";
import Header from "../ui/Header";
import { Link } from "react-router-dom"; // a React element for linking
import { gear } from "../../data/gear";
// import Item from "../ui/Item";
// import SingleLevel from "../ui/SingleLevel"; // new single level component that only views one level at a time
import ItemCard from "../ui/ItemCard"; // new single level component that only views one level at a time
import orderBy from "lodash/orderBy";

export default class ItemList extends React.Component {
   constructor() {
      super(); // boilerplate

      // set default state values for each component
      this.state = {
         isShowingPacked: false,
         isPackedOnBottom: false,
      };
   }

   // methods happen here, such as what happens when you click on a button

   // toggle show packed items
   toggleShowPacked() {
      this.setState({ isShowingPacked: !this.state.isShowingPacked });
   }

   // toggle put packed on bottom
   togglePackedOnBottom() {
      this.setState({ isPackedOnBottom: !this.state.isPackedOnBottom });
   }

   // // toggle show packed items
   // unpackAll() {
   //    this.setState({ isPacked: !this.state.isPacked });
   // }

   renderContainingItems(items, parentItemLevel) {
      // get indices for each item (used in their pages' urls)
      for (let i in items) {
         items[i].index = i;
      }
      // console.log("items with indices", items);

      let displayedItems = []; // initialize a new list for displayed items

      displayedItems = orderBy(items, "name", "asc"); // sort the items by name

      // sort the items by packed status if desired, with packed items on bottom
      if (this.state.isPackedOnBottom) {
         displayedItems = orderBy(displayedItems, "isPacked", "asc");
      }

      // hide packed items if desired
      if (this.state.isShowingPacked === false) {
         displayedItems = displayedItems.filter(
            (item) => item.isPacked === false
         ); // keep only the unpacked items
      }

      // render each sub item
      return displayedItems.map((item) => {
         return (
            // <Item
            //    key={item.name}
            //    itemData={item}
            //    itemLevel={parentItemLevel + 1}
            // />
            <ItemCard
               key={item.name}
               itemData={item}
               itemLevel={parentItemLevel + 1}
               itemIndex={item.index}
               parentName={item.name}
            />
         );
      });

      // return <div className="card-body">{outputPieces}</div>;
   }

   render() {
      // get the item data
      let itemData; // initialize itemData
      let parentName = null; // initialize the name of the parent
      let itemLevel = 0; // initialize the value that stores how many levels deep this page's item's level is
      // console.log("render");

      // if itemData was not passed to this
      // if (this.props.itemData === undefined) {
      // get the item based on the url index path (e.g. 3/2/4 would be item index 4 of item index 2 inside item index 3)

      const itemIndexPath = this.props.match.params.handle.split("-"); // represents the path to the item in a list of index numbers
      // console.log("itemIndexPath", itemIndexPath);
      itemData = gear;
      for (let levelIndex in itemIndexPath) {
         if (itemIndexPath[levelIndex] !== "") {
            parentName = itemData.name;
            itemData = itemData.items[parseInt(itemIndexPath[levelIndex])];
            itemLevel++;
         }
      }
      // const urlItemIndex = parseInt(this.props.match.params.handle); // gets the item index from the url
      // itemData = gear.items[urlItemIndex];
      // } else {
      //    itemData = this.props.itemData; // set itemData to the prop that was sent
      // }
      // console.log("itemData", itemData);

      console.log("itemLevel", itemLevel);

      return (
         <>
            <Header />
            <div className={"item-list color" + String(itemLevel % 3)}>
               <div className="container">
                  <div className="row">
                     <div className="col-12 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">
                        {parentName !== null && (
                           <Link
                              to={window.location.pathname.substring(
                                 0,
                                 window.location.pathname.lastIndexOf("-")
                              )}
                           >
                              Back to {parentName}
                           </Link>
                        )}
                        <h4>{itemData.name}</h4>
                        {/* {this.props.hasOwnProperty("parentName") && this.props.parentName} */}
                        <div className="row">
                           <div className="col">
                              <div className="custom-control custom-switch">
                                 <input
                                    type="checkbox"
                                    className="custom-control-input display-switch-label"
                                    id={"show-packed-switch" + itemData.name}
                                    checked={this.state.isShowingPacked}
                                    onChange={(e) => {
                                       this.toggleShowPacked(e);
                                    }}
                                    // onChange={(e) => {
                                    //    this.toggleShowPacked(e);
                                    // }}
                                 />
                                 <label
                                    className="custom-control-label display-switch-label"
                                    htmlFor={
                                       "show-packed-switch" + itemData.name
                                    }
                                 >
                                    Show {} Packed Items
                                 </label>
                              </div>
                              {/* need to make this switch only render if we are seeing packed items */}
                              {this.state.isShowingPacked && (
                                 <div className="custom-control custom-switch">
                                    <input
                                       type="checkbox"
                                       className="custom-control-input display-switch-label"
                                       id={
                                          "packed-on-bottom-switch" +
                                          itemData.name
                                       }
                                       checked={this.state.isPackedOnBottom}
                                       onChange={(e) => {
                                          this.togglePackedOnBottom(e);
                                       }}
                                    />
                                    <label
                                       className="custom-control-label display-switch-label"
                                       htmlFor={
                                          "packed-on-bottom-switch" +
                                          itemData.name
                                       }
                                    >
                                       Move Packed to Bottom
                                    </label>
                                 </div>
                              )}
                           </div>
                        </div>
                        <div className="row">
                           <div className="col">
                              <button className="btn action-button">
                                 Unpack All
                              </button>
                           </div>
                        </div>
                        <div className="row">
                           <div className="col">
                              {/* {itemData.items.map((subItem) => {
                     return <ItemCard key={"sdfs"} itemData={subItem} />;
                  })} */}
                              {this.renderContainingItems(
                                 itemData.items,
                                 itemLevel
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </>
      );
   }
}
