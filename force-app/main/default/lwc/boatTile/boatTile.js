import { LightningElement, api } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";

export default class BoatTile extends LightningElement {
    @api boatData;
    @api selectedBoatId;

    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() { 
        return `background-image:url(${this.boatData.Picture__c})`;
    }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() { 
        if (this.selectedBoatId == this.boatData.Id) {
            return TILE_WRAPPER_SELECTED_CLASS;
        } else {
            return TILE_WRAPPER_UNSELECTED_CLASS;
        }
    }
    
    // Fires event with the Id of the boat that has been selected.
    selectBoat() { 
        const boatId = this.boatData.Id;
        this.dispatchEvent(new CustomEvent('boatselect', { detail: boatId}));
    }
  }