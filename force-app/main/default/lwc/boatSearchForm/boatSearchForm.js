import { LightningElement, api, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';
    error = undefined;
    searchOptions;

    @wire(getBoatTypes)
    boatTypes({ error, data }) {
        if (data) {
            this.searchOptions = data.map(type => {
               return { value: type.Id, label: type.Name }
            });
            this.searchOptions.unshift({ label: 'All Types', value: ''});
        } else if (error) {
            this.searchOptions = undefined;
            this.error = error;
        }
    }

    handleSearchOptionChange(event) {
        this.selectedBoatTypeId = event.target.value;
        const searchEvent = new CustomEvent('search', { detail: { boatTypeId: this.selectedBoatTypeId } });
        this.dispatchEvent(searchEvent);
    }

}