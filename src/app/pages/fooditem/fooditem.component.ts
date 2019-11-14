import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FoodItemService } from '../../services/food-item/food-item.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDialogPopupComponent } from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import { FFQFoodNutrientsResponse } from 'src/app/models/ffqfoodnutrients-response';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { FFQFoodNutrients } from 'src/app/models/ffqfoodnutrients';
import { FFQFoodItem } from 'src/app/models/ffqfooditem';
import { FFQNutrientlist, nutrientMap } from 'src/app/models/ffqnutrientlist';
import { NutrientConstants } from 'src/app/models/NutrientConstants';
import { NutrientsService } from 'src/app/services/nutrients/nutrients-service';
import { FormsModule } from '@angular/forms';


// fooditem page added by Daykel Muro 10/2/2019
@Component({
  selector: 'app-fooditem',
  templateUrl: './fooditem.component.html',
  styleUrls: ['./fooditem.component.css']
})
export class FooditemComponent implements OnInit {

  TITLE = 'FFQR Food Item Portal';
  private routeSub: Subscription;
  private isNew: boolean;
  private isUpdate: boolean;
  showMsg: boolean = false;

  constructor(
    public foodService: FoodItemService,
    public nutrientsService: NutrientsService,
    private activatedRoute: ActivatedRoute,
    private errorDialog: MatDialog,
    private submissionErrorDialog: MatDialog,
    private httpErrorDialog: MatDialog,
    private successDialog: MatDialog,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    ) { }


  nutrientsMap: Map<string,FFQNutrientlist> = new Map<string,FFQNutrientlist>();

  foodNutrientsItem: FFQFoodNutrients[] = [];
  dataLoaded: Promise<boolean>;

  ffqfoditem: FFQFoodItem;
  ffqnutrientlist: Array<FFQNutrientlist> = new Array<FFQNutrientlist>();
  foodNutrients: FFQFoodNutrients;
  ffqfoodnutrients: FFQFoodNutrients;

  ffgNutrientMap: nutrientMap;

  ngOnInit() {

    const FoodItemObjectId = this.route.snapshot.paramMap.get('id');

    if (FoodItemObjectId == "new"){
      
      this.isNew = true;

      this.ffqfoditem = new FFQFoodItem("");
      this.ffqnutrientlist.push(new FFQNutrientlist("", new nutrientMap("","")));
      //this.ffqnutrientlist.nutrientListID = "test";

      //this.ffqnutrientlist.nutrientMap = new Map<String, number>();

      //for (var nutrient  of NutrientConstants.NUTRIENT_NAMES){
        //this.ffqnutrientlist.nutrientMap.set(nutrient,0);
      //}

      //console.log(this.ffqnutrientlist.nutrientMap);
      this.foodNutrients = new FFQFoodNutrients(this.ffqfoditem, this.ffqnutrientlist);
      //this.ffqfoodnutrients = FFQFoodNutrients.foodItemFromResponse(this.foodNutrientsResponse);
      console.log(this.foodNutrients);

      this.foodNutrientsItem.push(this.foodNutrients);
      this.dataLoaded = Promise.resolve(true);

    }
    else{
      this.isUpdate = true;
      this.getFoodByObjectId(FoodItemObjectId);

      console.log(this.foodNutrientsItem);
    }
  }

  private getFoodByObjectId(name: string) {

    // retrieve the food item
    this.foodService.getFoodbyName(name).subscribe(data => {
      
      //retrieve the nutrients lists for each food item's food type
      for (let i of data.foodItem.foodTypes) {
        
        this.nutrientsService.getNutrientsById(i.nutrientListID).subscribe(nutrientList => {

          this.nutrientsMap.set(i.nutrientListID, nutrientList.nutrientMap);
        });        
      }
      
      console.log(this.nutrientsMap);
      
      
      this.foodNutrientsItem.push(FFQFoodNutrients.foodItemFromResponse(data))
    });
    this.dataLoaded = Promise.resolve(true);
  }

  private addFoodNutrients(form:NgForm){  
    
    console.log(this.foodNutrientsItem[0]);
    //this.foodNutrientsItem[0].nutrientList.nutrientListID = this.foodNutrientsItem[0].foodItem.foodTypes[0].nutrientListID;
    //this.foodNutrientsItem[0].foodItem.nutrientId = this.foodNutrientsItem[0].foodItem.foodTypes[0].nutrientListID;
     this.foodService.addFoodNutrients(FFQFoodNutrients.foodItemToResponse(this.foodNutrientsItem[0])).subscribe(
     data => {this.router.navigateByUrl('/admin');
     const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
     dialogRef.componentInstance.title = 'Food item added succesfully!';
    },
    error =>{
      const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = error.error.message;
    }
     
    );
    
  }

  private updateFoodNutrients(){  
    console.log(this.foodNutrientsItem[0]);
    //this.foodNutrientsItem[0].nutrientList.nutrientListID = this.foodNutrientsItem[0].foodItem.foodTypes[0].nutrientListID;
    //this.foodNutrientsItem[0].foodItem.nutrientId = this.foodNutrientsItem[0].foodItem.foodTypes[0].nutrientListID;
    this.foodService.updateFoodNutrients(FFQFoodNutrients.foodItemToResponse(this.foodNutrientsItem[0])).subscribe(
     data => {this.router.navigateByUrl('/admin');
     const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
     dialogRef.componentInstance.title = 'Food item updated succesfully!';}
     
    );
    
  }

  trackByFn(item, id){
    return item
  }
}

export class FoodNutrientsMap {
  typeName: string;
  nutrientListID: string;

  constructor(typeName: string, nutrientListID: string){
    this.typeName = "";
    this.nutrientListID = "";
  }

 
}


