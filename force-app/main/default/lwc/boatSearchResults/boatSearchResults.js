import { LightningElement, wire, api, track } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { refreshApex } from '@salesforce/apex';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', editable: true},
    { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true},
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true},
    { label: 'Description', fieldName: 'Description__c', type: 'text', editable: true}
  ];
  boatTypeId = '';
  @track boats;
  isLoading = false;
  @track
  draftValues = [];
  wiredBoatsResults;
  
  @wire(MessageContext)
  messageContext;

  @wire(getBoats, { boatTypeId: '$boatTypeId'})
  wiredBoats(results) { 
    this.wiredBoatsResults = results;
    if (results.data) {
        this.boats = results.data; 
    } else if (results.error) {
        console.log(results.error);
    }
  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) { 
    this.boatTypeId = boatTypeId;
    this.notifyLoading(this.isLoading);
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  async refresh() { 
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    refreshApex(this.wiredBoatsResults);
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
    this.selectedBoatId = event.detail;

    this.sendMessageService(this.selectedBoatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
    publish(this.messageContext, BOATMC, { recordId: boatId });
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values

  handleSave(event) {
    // notify loading
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
      .then(result => {
        const evt = new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(evt);
        this.draftValues = [];
        this.refresh();
      })
      .catch(error => {
        const evtError = new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.message,
          variant: ERROR_VARIANT
        });
      this.dispatchEvent(evtError);
      })
      .finally(() => {this.draftValues = [];});
  }

  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) { 
    if (isLoading) this.dispatchEvent(new CustomEvent('loading'));
    if (!isLoading) this.dispatchEvent(new CustomEvent('doneloading'));
  }
}