import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {
  fieldsAvailable = [
    {
    "key": "doctor_name",
    "example": "Dr.Will Smith"
    },
    {
    "key": "patient_name",
    "example": "John Doe"
    },
    {
    "key": "dob",
    "example": "01/01/2000"
    },
    {
    "key": "age",
    "example": "30 y/o"
    },
    {
    "key": "gender_full",
    "example": "Male"
    },
    {
    "key": "gender_half",
    "example": "M"
    },
    {
    "key": "practice_name",
    "example": "Test Practice"
    },
    {
    "key": "practice_link",
    "example": "https://abc.com"
    },
    {
    "key": "doctor_login",
    "example": "https://abc.com/login"
    }
    ]
  
  editorOptions = {
    theme: "vs-dark",
    language: "javascript",
    autoIndent: true,
    
  };
  // code:FormControl = new FormControl();
  code: FormControl = new FormControl(
    `
var dd = {
          content: [
            'First paragraph',
            'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
          ]
}`
);
  blob = null;
  editor: any;
  constructor() {}

  ngOnInit(): void {
    this.code.valueChanges
      .pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe((dd) => {
        if (dd.value !== null) {
          dd = dd.replace(
            /%(\w+)%/g,
            (match, field) => {
              const ex = this.fieldsAvailable.find(
                (f) => f.key === field
              );
              if (ex) {
                return ex.example;
              }
              return match;
            }
          );
          dd.trim();
        }
       window.eval(dd);
        
       this.getPDFBlob();
      });
  }
  onInit(editor) {
    this.editor = editor;
  }
  getPDFBlob() {
    console.log('Inside pdf blob');
    pdfMake.createPdf(
      (window as any).dd).getDataUrl((dataUrl) => {
        console.log('dataUrl '+dataUrl);
      this.blob = dataUrl;
    });
   
  }
  }


