import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { faker } from '@faker-js/faker';
@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;

  education: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];

  genderList: string[] = ['Male', 'Female', 'Others'];

  constructor(
    private _fb: FormBuilder,
    private _apiService: ApiService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBarService: SnackBarService
  ) {
    this.empForm = this._fb.group({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: '',
      education: '',
      company: '',
      experience: '',
      salary: 0,
    });
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }

  onFormSubmit() {
    this.replaceWithMock();
    if (this.empForm.valid) {
      if (this.data) {
        this._apiService
          .updateEmployee(this.data.id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              this._snackBarService.openSnackBar('Employee detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._apiService.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {
            this._snackBarService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
  randomElementInArray(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
  }
  replaceWithMock() {
    const mock = {
      firstName: faker.internet.userName(),
      lastName: faker.internet.userName(),
      email: faker.internet.email(),
      dob: faker.date.birthdate(),
      gender: this.randomElementInArray(this.genderList),
      education: this.randomElementInArray(this.education),
      company: faker.company.name(),
      experience: faker.number.int({ min: 0, max: 20 }),
      salary: faker.finance.amount(),
    };
    this.empForm.patchValue(mock);
  }
}
