import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';


@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
})
export class NoticePage implements OnInit {
  showSpinner = false;
  url = "http://laraveldevelopers.website/dev21/uhk/public/api/cms-details";
  response = [];
  result = {};
  cmsId = 0;

  correctPath: any;
  imgBlob = null;
  filename = "";
  returnpath: string = "";
  fileExtension: string = "";

  validation_messages = {
    'name': [{ type: 'required', message: 'Name required' }],
    'email': [{ type: 'required', message: 'Email required' }],
    'phone': [{ type: 'required', message: 'Phone required' }],
    //'address':[{type:'required', message: 'Firstname required'}],
    'qualification': [{ type: 'required', message: 'Qualification required' }],
    'skill': [{ type: 'required', message: 'Skills required' }],
    //'photo': [{ type: 'required', message: 'Choose photo' }]
  }

  myform: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private apiService: ApiService,
    private toastController: ToastController, private camera: Camera, private platform: Platform, private filePath: FilePath,
    private file: File, private http: HttpClient, private filechooser: FileChooser, private filetransfer: FileTransfer) {

    if (this.router.getCurrentNavigation().extras.state) {
      this.cmsId = this.router.getCurrentNavigation().extras.state.cmsId;
    }
    this.myform = formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      qualification: new FormControl('', [Validators.required]),
      skill: new FormControl('', [Validators.required]),
      //photo: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    this.apiCallForCmsList();
  }

  go() {
    this.router.navigate(['/contact'])
  }
  formSubmit() {
    console.log(this.myform.value.name + " ", this.myform.value.email);
  }

  /*====== Api call for Notice start ====== */
  apiCallForCmsList() {
    this.showSpinner = true;
    let urlNotice = this.url + "/" + this.cmsId
    this.apiService.ApiCall('POST', urlNotice, null).subscribe(data => {
      console.log(typeof data)

      console.log("hereee " + JSON.parse(JSON.stringify(data)).data)
      if (data.Ack === 1) {
        this.showSpinner = false
        this.result = data.data
        this.response = JSON.parse(JSON.stringify(data)).data;
        if (data.data.description != null) {
          document.getElementById("noticeDescription").innerHTML = data.data.description;
        }
      } else if (data.Ack === 0) {
        this.showSpinner = false
        this.result = {};
      }
      console.log("result cms", this.result);

    });
  }
  /*====== Api call for Notice end ====== */

  /*============= Api call for notice start ============*/
  sendPostRequest() {

    console.log("file method called")
    this.showSpinner = true
    // var headers = new Headers();
    //alert(this.myform.value.name+" "+ this.myform.value.email+" "+this.myform.value.phone)
    console.log(this.myform.value.name + " " + this.myform.value.email + " " + this.myform.value.phone);

    let postData = {
      "name": this.myform.value.name,
      "email": this.myform.value.email,
      "qualification": this.myform.value.phone,
      "address": this.myform.value.address,
      "phone_no": this.myform.value.subject,
      "skill": this.myform.value.message

      //"device_id": "6653f6bc-22d6-56d4-3582-400511111108"
    }
    var formData = new FormData();

    formData.append("name", this.myform.value.name),
      formData.append("email", this.myform.value.email),
      formData.append("qualification", this.myform.value.qualification),
      formData.append("address", this.myform.value.address),
      formData.append("phone_no", this.myform.value.phone),
      formData.append("skill", this.myform.value.Skill),
      formData.append("cv_file", this.imgBlob, this.filename)

    if (this.filename === '') {
      this.presentToast("Select file")
    } else {
      this.http.post("http://laraveldevelopers.website/dev21/uhk/public/api/submit-notice-information", formData,
        { headers: new HttpHeaders({ 'Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz' }) }).subscribe(data => {
          console.log("filedata " + JSON.stringify(data));
          alert(JSON.stringify(data))
        }, error => {
          console.log("error message " + error);
        })
    }

  }
  /*============= Api call for notice end ============*/
  /* To show toast message */
  async presentToast(mess: string) {
    const toast = await this.toastController.create({
      message: mess,
      duration: 1000
    });
    toast.present();
  }

  selectFile() {

    this.filechooser.open().then(fileUri => {
      
      this.filePath.resolveNativePath(fileUri).then(resolvedNativePath => {
        this.returnpath = resolvedNativePath;
        console.log("filepath: "+ this.returnpath);
        alert(this.returnpath);
        this.startUpload(this.returnpath);

        // const fileTransfer: FileTransferObject = this.filetransfer.create();
        // let options: FileUploadOptions = {
        //   fileKey: 'cv_file',
        //   fileName: this.filename,
        //   chunkedMode: false,
        //   headers: { 'Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz' },
        //   mimeType: 'pdf/docx',
        //   params: {
        //     "name": this.myform.value.name,
        //     "email": this.myform.value.email, "qualification": this.myform.value.qualification, "address": this.myform.value.address,
        //     "phone_no": this.myform.value.phone, "skill": this.myform.value.Skill
        //   }
        // }

        // fileTransfer.upload(this.returnpath, "http://laraveldevelopers.website/dev21/uhk/public/api/submit-notice-information", options)
        //   .then((data) => {
        //     // success
        //     alert(JSON.stringify(data));
        //   }, (err) => {
        //     // error
        //     alert(err);
        //   })

      })
    })
  }

  startUpload(path: string) {
    if (this.file) {
      this.file.resolveLocalFilesystemUrl(path)
        .then(entry => {
          (<FileEntry>entry).file(file =>
            this.readFile(file))
        })
        .catch(err => {
          this.presentToast('Error while reading file.');
        });
    }
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imgBlob = new Blob([reader.result], {
        type: file.type
      });

      this.fileExtension = this.filename.substr(this.filename.lastIndexOf('/') + 1);

      if (this.fileExtension === ".pdf" || this.fileExtension === ".docx") {
        this.filename = file.name;
      } else {
        this.presentToast("Select only pdf or docx file")
      }

      document.getElementById("filename").innerHTML = this.filename
      console.log("sss " + this.imgBlob + " , " + this.filename);
      alert(this.imgBlob + " , " + this.filename + " , " + this.fileExtension);
    };
    reader.readAsArrayBuffer(file);
  }
}
