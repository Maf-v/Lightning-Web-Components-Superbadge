import { LightningElement, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { MessageContext, subscribe } from "lightning/messageService";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import { NavigationMixin } from 'lightning/navigation';

// Custom Labels Imports
// import labelDetails for Details
import Details from "@salesforce/label/c.Details";
// import labelReviews for Reviews
import Reviews from "@salesforce/label/c.Reviews";
// import labelAddReview for Add_Review
import Add_Review from "@salesforce/label/c.Add_Review";
// import labelFullDetails for Full_Details
import Full_Details from "@salesforce/label/c.Full_Details";
// import labelPleaseSelectABoat for Please_select_a_boat
import Please_select_a_boat from "@salesforce/label/c.Please_select_a_boat";
// Boat__c Schema Imports
// import BOAT_ID_FIELD for the Boat Id
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
// import BOAT_NAME_FIELD for the boat Name
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  boatId;
  label = {
    labelDetails: Details,
    labelReviews: Reviews,
    labelAddReview: Add_Review,
    labelFullDetails: Full_Details,
    labelPleaseSelectABoat: Please_select_a_boat,
  };

  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS})
  wiredRecord;
  
  @wire(MessageContext)
  messageContext;
  
  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() { 
    return this.wiredRecord.data ? 'utility:anchor' : null;
  }
  
  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() { 
    return getFieldValue(this.wiredRecord, BOAT_NAME_FIELD);
  }
  
  // Private
  subscription = null;
  
  // Subscribe to the message channel
  subscribeMC() {
    if (this.subscription) return;
    // local boatId must receive the recordId from the message
    this.subscription = subscribe(this.messageContext, BOATMC, (message) => {
        this.boatId = message.recordId;
    });
  }
  
  // Calls subscribeMC()
  connectedCallback() { 
    this.subscribeMC();
  }
  
  // Navigates to record page
  navigateToRecordViewPage() { 
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            objectApiName: BOAT_NAME_FIELD,
            recordId: this.boatId,
            actionName: 'view'
        }
    });
  }
  
  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() { }
}