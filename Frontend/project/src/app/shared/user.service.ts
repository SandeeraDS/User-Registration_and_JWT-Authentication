import { Injectable } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private fb: FormBuilder, private http: HttpClient) {}
  readonly BaseURI = "http://localhost:51638/api";

  //define form cotrolls
  formModel = this.fb.group({
    //default valui and validators
    UserName: ["", Validators.required],
    Email: ["", Validators.email],
    FullName: [""],
    //another group object for password
    Passwords: this.fb.group(
      {
        // if there more validators, they are passed by array
        Password: ["", [Validators.required, Validators.minLength(4)]],
        ConfirmPassword: ["", Validators.required]
      },
      { validator: this.comparePasswords }
    )
  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get("ConfirmPassword");

    //here compare the passwords
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if (
      confirmPswrdCtrl.errors == null ||
      "passwordMismatch" in confirmPswrdCtrl.errors
    ) {
      if (fb.get("Password").value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };
    return this.http.post(this.BaseURI + "/ApplicationUser/Register", body);
  }
}
