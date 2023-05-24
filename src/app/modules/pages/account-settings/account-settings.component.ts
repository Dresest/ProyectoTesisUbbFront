import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/_services/auth.service';
import { ProfesionalService } from 'src/app/core/_services/profesional.service';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public linkTheme = document.querySelector('#theme');
  public links!: NodeListOf<Element>;;

  // profesional
  profesional: any;
  profesionalForm: FormGroup = new FormGroup({});
  profesionalRut: any;
  mostrarInformacion = true;
  informacionOriginal: any;
  constructor(    
    private _authService: AuthService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private _profesionalService: ProfesionalService,
    
    ) { }

  ngOnInit(): void {
    this.links = document.querySelectorAll('.selector');
    this.checkCurrentTheme();
    this.profesional = this._authService.obtenerInformacionToken();
    console.log(this.profesional);
    this.profesionalForm = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      direccion: [''],
      email: [''],
      telefono: ['']
    });
  
    this._profesionalService.obtenerProfesionalPorRut(this.profesional.rut).subscribe(
      (response) => {
        this.profesionalRut = response.profesional;
  
        this.profesionalForm.patchValue({
          nombre: this.profesionalRut.nombre,
          apellido: this.profesionalRut.apellido,
          direccion: this.profesionalRut.direccion,
          email: this.profesionalRut.email,
          telefono: this.profesionalRut.telefono
        });
      },
      (error) => {
        console.error(error);
      }
    );
  
    this.informacionOriginal = { ...this.profesional };
  }



  changeTheme(theme:String){
    
   const url = `./assets/css/colors/${theme}.css`
   this.linkTheme?.setAttribute('href',url);
   localStorage.setItem('theme',url);
   this.checkCurrentTheme();
  }

  checkCurrentTheme(){

   
    this.links.forEach(elem =>{

      elem.classList.remove('working');

      const btnTheme = elem.getAttribute('data-theme');

      const btnThemeUrl = `./assets/css/colors/${ btnTheme }.css`

      const currentTheme = this.linkTheme?.getAttribute('href');


      if ( btnThemeUrl === currentTheme ){
        elem.classList.add('working');
      }

    })

  }


  toggleInformacion(): void {
    if (this.mostrarInformacion) {
      this.informacionOriginal = { ...this.profesional };
    }
    this.mostrarInformacion = !this.mostrarInformacion;
  }

  cancelarEdicion(): void {
    this.profesional = { ...this.informacionOriginal };
    this.profesionalForm.patchValue(this.informacionOriginal);
    this.mostrarInformacion = true;
    this.ngOnInit();
  }

  onRutInput(event: any) {
    let rut = event.target.value.replace(/[^\d]/g, ''); // Eliminar todo excepto los dígitos
    rut = rut.substring(0, rut.length - 1) + '-' + rut.substring(rut.length - 1); // Insertar guión antes del dígito verificador
    rut = rut.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.'); // Agregar puntos de separación de miles
    this.profesionalForm.patchValue({ rut: rut });
  }


  guardarCambios(): void {
    this.mostrarInformacion = true;

    const datosFormulario = this.profesionalForm.value;
    const hayCambios = JSON.stringify(this.informacionOriginal) !== JSON.stringify(datosFormulario);
    if (hayCambios) {
      this._profesionalService.actualizarInformacionProfesional(this.profesional.id, this.profesionalForm.value).subscribe(
        (response) => {
          this.toastService.showSuccess('La información del profesional se ha actualizado exitosamente');
          this.mostrarInformacion = true;
          this.ngOnInit();
        }
      );
  }
}
}
