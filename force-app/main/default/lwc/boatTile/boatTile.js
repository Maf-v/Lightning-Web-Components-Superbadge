import { LightningElement, api } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";

export default class BoatTile extends LightningElement {
    @api boatData;
    selectedBoatId;

    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() { 
        return `background-image:url(${this.boatData.Picture__c})`;
    }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() { }
    
    // Fires event with the Id of the boat that has been selected.
    selectBoat() { }
  }