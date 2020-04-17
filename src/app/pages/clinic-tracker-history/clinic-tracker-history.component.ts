import { Component, OnInit } from '@angular/core';
import { TrackerResultsResponse } from 'src/app/models/trackerResultsResponse';
import { TrackerResultsService } from 'src/app/services/tracker-results/tracker-results.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { TrackerItems } from 'src/app/models/trackeritems';
import { Observable } from 'rxjs';
import { FFQParentResponse } from 'src/app/models/ffqparent-response';
import { ParentService } from 'src/app/services/parent/parent-service';
import { FFQParent } from 'src/app/models/ffqparent';
import { FFQClinicResponse } from 'src/app/models/ffqclinic-response';
import { ClinicService } from 'src/app/services/clinic/clinic-service';

@Component({
  templateUrl: './clinic-tracker-history.component.html',
  styleUrls: ['./clinic-tracker-history.component.css']
})
export class ClinicTrackerHistoryComponent implements OnInit {

  results: TrackerResultsResponse[] = [];
  private parentIds: string[] = [];
  private clinicId: string;
  allParents: string[] = [];
  
  constructor(private trackerResultsService: TrackerResultsService,
              private authenticationService: AuthenticationService,
              public parentService: ParentService,
              public clinicService: ClinicService
              ) { }

  ngOnInit() {
    this.allParents.push("");
    this.getClinicId();
    this.getParents();
    this.getAllResults();

    
    // test items
    // for(let i = 0; i < 10; i++) {
    //   this.results[i] = new TrackerResultsResponse("1", i, "4/"+i+"/20", [new TrackerItems("food1", "Above"),
    //                                                                       new TrackerItems("food2", "Equal"),
    //                                                                       new TrackerItems("food3", "Below")]);
    // }
  }

  private getAllResults() {
    this.trackerResultsService.getAllResults().subscribe(results => {
      results.forEach(result =>
        {
          if(this.parentIds.indexOf(result.userId) >= 0)
          {
            this.results.push(result);
          }
        })
      this.results = this.results.reverse();
    });
  };

  private getClinicId(){

    var clinicListObervable: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    const loggedInUser = this.authenticationService.currentUserValue;
    var clinicId: string;

    //console.log("Logged in user clinic: " + loggedInUser[0].assignedclinic);
    clinicListObervable.subscribe(clinicList => {
      var clinic = clinicList.find(a => a.clinicId == loggedInUser[0].assignedclinic);
      if(clinic){
        this.clinicId = clinic.clinicId;
        //console.log("clinic ID in function");
        //console.log(this.clinicId);
      }
    });

  }

  getParents()
  {
    var parentListObservable: Observable<FFQParentResponse[]> = this.parentService.getAllParents();

    parentListObservable.subscribe(parentList => {
      parentList.forEach(parent => {
        this.allParents.push(parent.firstname + " " + parent.lastname);
        if(parent.assignedclinic == this.clinicId){
          //clinicianInClinic.push(clinician);
          this.parentIds.push(parent.userId);
        }
      });
      //console.log("parentList in function");
      //console.log(this.parentList);
    });
  }
}