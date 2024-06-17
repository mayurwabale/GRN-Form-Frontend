import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { GrnFormService } from './../services/grn-form.service'
interface Company {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-basic-details',
  standalone: true,
  imports: [MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    NgFor,
    AsyncPipe,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatStepperModule,
    DatePipe
  ],
  templateUrl: './basic-details.component.html',
  styleUrl: './basic-details.component.scss'
})
export class BasicDetailsComponent implements OnInit {
  companies: Company[] = [
    { value: 'A0', viewValue: 'A Pvt Ltd.' },
    { value: 'B0', viewValue: 'B Pvt Ltd.' },
    { value: 'C0', viewValue: 'C Pvt Ltd.' },
  ];

  myControl = new FormControl('');
  options: string[] = ['A-Store', 'B-Store', 'C-Store'];
  isLinear=false;
  itemCategory: Company[] = [
    { value: 'itemCat1', viewValue: 'Seeds' },
    { value: 'itemCat2', viewValue: 'Plants' },
    { value: 'itemCat3', viewValue: 'Herbs' },
  ];
  items = [
    { value: 'item1', viewValue: 'Seeds', itemCategory: 'itemCat1' },
    { value: 'item2', viewValue: 'Plants', itemCategory: 'itemCat2' },
    { value: 'item3', viewValue: 'Herbs', itemCategory: 'itemCat3' },
  ]

  strains = [
    { value: 'strain1', viewValue: 'StrainA', item: 'item1' },
    { value: 'strain2', viewValue: 'StrainB', item: 'item2' },
    { value: 'strain3', viewValue: 'StrainC', item: 'item3' },
  ]

  UOM = [
    { value: 'kg', viewValue: 'KG' },
    { value: 'm', viewValue: 'Meter' },
    { value: 'cm', viewValue: 'CM' },
  ]
  filteredOptions!: Observable<string[]>;

  grnForm: FormGroup = new FormGroup({
    crnT: new FormArray([this.getCrnDetails()])
  });
  basicDetailsFormData: {
    selectedCompany: string,
    selectedStore: string,
    datePicker: Date,
    remarks: string,
    CRN?: {}[]
  }[] = [];
  showCompanyName = '';
  showSelectedStore = ''
  showSelectedDate!: Date|string
  basicDetailsForm: FormGroup = new FormGroup({
    selectCompany: new FormControl('', [Validators.required]),
    datePicker: new FormControl('', [Validators.required]),
    selectStore: new FormControl('', [Validators.required]),
    remarks: new FormControl(''),
  })
  constructor(private _GrnFormService: GrnFormService) { }
  ngOnInit() {
    this.filteredOptions = this.basicDetailsForm.controls['selectStore'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getCrnDetails(): FormGroup {
    return new FormGroup({
      itemCategory: new FormControl(''),
      item: new FormControl(''),
      strain: new FormControl(''),
      quantity: new FormControl('', [Validators.pattern(/^[0-9]\d*$/)]),
      uom: new FormControl(''),
      totalCost: new FormControl(''),
      costPerUnit: new FormControl(''),
      supplier: new FormControl(''),
    })
  }

  crnListArray() {
    return this.grnForm.get('crnT') as FormArray
  }

  onItemcategory(event: any) {
    let filteredItem = this.items.filter(ele => ele.itemCategory === event.value);
    this.items = event.value ? filteredItem : this.items;
  }

  onItemSelected(event: any) {
    let filteredStrains = this.strains.filter(ele => ele.item === event.value);
    this.strains = event.value ? filteredStrains : this.strains;
  }
  
  addGRN() {
    this.crnListArray().push(this.getCrnDetails())
  }

  removeGRN(i: number) {
    this.crnListArray().removeAt(i)
  }

  clearGRN(i: number) {
    this.crnListArray().controls[i].reset();
    console.log(this.crnListArray().controls[i].reset());
  }

  gotoPreviousStep(stepper: MatStepper) {
    stepper.previous();
  }

  saveBasicDetails(stepper: MatStepper) {
    this.basicDetailsFormData.push({
      selectedCompany: this.basicDetailsForm.value.selectCompany,
      selectedStore: this.basicDetailsForm.value.selectStore,
      datePicker: this.basicDetailsForm.value.datePicker,
      remarks: this.basicDetailsForm.value.remarks,
    })
    this.showCompanyName = this.basicDetailsFormData[0].selectedCompany;
    this.showSelectedStore = this.basicDetailsFormData[0].selectedStore
    this.showSelectedDate = this.basicDetailsFormData[0].datePicker
    stepper.next();
  }

  submitGrnForm(stepper: MatStepper) {
    
    this.basicDetailsFormData[0].CRN = this.grnForm.value.crnT;

    this._GrnFormService.saveGRNForm('http://localhost:3200/api/save-Grn', this.basicDetailsFormData).subscribe(res => {
      console.log(res);
      this.basicDetailsForm.reset();
      this.grnForm.reset();
      this.showCompanyName='';
      this.showSelectedStore='';
      this.showSelectedDate='';
      stepper.previous();
    })
  }
}
