import { LightningElement } from "lwc";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";
import NavigationMixin from 'lightning/navigation';

export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
    boatReviews;
    isLoading;
    
    // Getter and Setter to allow for logic to run on recordId change
    get recordId() { 
      return this.boatId;
    }
    set recordId(value) {
      //sets boatId attribute
      this.boatId = value;
      //sets boatId assignment
      this.setAttribute('recordId', this.boatId);
      //get reviews associated with boatId
      this.getReviews();
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() { 
      if (!this.boatReviews) return false;
      return true;
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    refresh() { }
    
    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() { 
      if (!this.boatId) return;
      this.isLoading = true;
      getAllReviews(this.boatId)
        .then(result => {this.boatReviews = result;})
        .catch(error => {this.error = error;});
      this.isLoading = false;
    }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {  
      console.log(event);
      /* this[NavigationMixin.Navigate]({
        type: 'standard_recordPage',
        attributes: {
          dataRecordId: ,
          actionName: 'view',
        }
      }) */
    }
  }