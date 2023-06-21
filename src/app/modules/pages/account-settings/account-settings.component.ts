import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public links!: NodeListOf<Element>;
  passwordForm: FormGroup = new FormGroup({});
  // profesional
  cambiarpass = false;
  profesionales: any[] = [];
  profesional: any;
  profesionalForm: FormGroup = new FormGroup({});
  profesionalRut: any;
  mostrarInformacion = true;
  informacionOriginal: any;
  storedPassword = "";
  idCorrecto = false;
  inicio: number = 0;
  ordenAscendenteP: boolean = true;
  ordenAscendenteRut: boolean = true;
  ordenAscendenteDireccion: boolean = true;
  ordenAscendenteTelefono: boolean = true;
  ordenAscendenteEmail: boolean = true;
  ordenAscendenteEstado: boolean = true;


  emailForm: FormGroup ;
  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  constructor(   private readonly fb: FormBuilder,
    private _authService: AuthService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private _profesionalService: ProfesionalService,
  ) { 

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    });
  }

  ngOnInit(): void {
    this.profesional = this._authService.obtenerInformacionToken();

    if (this.profesional.id === 2) {
      this.idCorrecto = true;
      this.obtenerprofesionales();
    } else {
      this.idCorrecto = false;
    }
    
    this.profesionalForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      rut: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      telefono: ['', Validators.required],
      contraseña: [''],
    });

    this.passwordForm = this.formBuilder.group({
      newpass: ['', [Validators.required]],
      password_confirm: ['', [Validators.required]],
    }, { validator: this.checkPasswords });

    this._profesionalService.obtenerProfesionalPorRut(this.profesional.rut).subscribe(
      (response) => {
        this.profesionalRut = response.profesional;

        this.profesionalForm.patchValue({
          nombre: this.profesionalRut.nombre,
          apellido: this.profesionalRut.apellido,
          direccion: this.profesionalRut.direccion,
          email: this.profesionalRut.email,
          telefono: this.profesionalRut.telefono,
          rut: this.profesionalRut.rut,
        });
      },
      (error) => {
        console.error(error);
      }
    );

    this.informacionOriginal = { ...this.profesional };
  }
  checkPasswords(group: any) {
    let pass = group.controls.newpass.value;
    let confirmPass = group.controls.password_confirm.value;

    return pass === confirmPass ? null : { notSame: true };
  }
  obtenerprofesionales(): void {
    this._profesionalService.profesionales().subscribe(respuesta => {
      this.profesionales = respuesta.profs.filter((p: any) => p.id_profesional !== 0);
      this.profesionales.sort((a: any, b: any) => {
        if (a.is_activo && !b.is_activo) {
          return 1; // a viene después de b
        } else if (!a.is_activo && b.is_activo) {
          return -1; // a viene antes de b
        } else {
          return 0; // no se cambia el orden
        }
      });
    });
  }
  
  
  desactivarProfesional(profesional: any): void {
    this._profesionalService.desactivar(profesional.id_profesional).subscribe(
      respuesta => {
        this.toastService.showSuccess("Se desactivo el profesional");
        this.obtenerprofesionales();
      },
      error => {
    
        
      }
    );
  }
  obtenerTextoPaginacion(): string {
    const paginaActual = Math.floor(this.inicio / 5) + 1;
    const totalPaginas = Math.ceil(this.profesionales.length / 5);

    return `Página ${paginaActual} de ${totalPaginas}`;
  }
  activarProfesional(profesional: any): void {

    this._profesionalService.activar(profesional.id_profesional).subscribe(
      respuesta => {
        this.toastService.showSuccess("Se activo el profesional");
        this.obtenerprofesionales();
     
      },
      error => {
    
        
      }
    );
  }
  ordenarPorNombre(): void {
    this.profesionales.sort((a: any, b: any) => {
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();
      if (nombreA < nombreB) {
        return this.ordenAscendenteP ? -1 : 1;
      }
      if (nombreA > nombreB) {
        return this.ordenAscendenteP ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteP = !this.ordenAscendenteP;
  }
  ordenarPorEstado(): void {
    this.ordenAscendenteEstado = !this.ordenAscendenteEstado;
  
    this.profesionales.sort((a: any, b: any) => {
      if (a.is_activo && !b.is_activo) {
        return this.ordenAscendenteEstado ? 1 : -1; // a viene después de b si el orden es ascendente, y antes si es descendente
      } else if (!a.is_activo && b.is_activo) {
        return this.ordenAscendenteEstado ? -1 : 1; // a viene antes de b si el orden es ascendente, y después si es descendente
      } else {
        return 0; // no se cambia el orden
      }
    });
  }
  
  ordenarPorRut(): void {
    this.profesionales.sort((a: any, b: any) => {
      const rutA = a.rut.toLowerCase();
      const rutB = b.rut.toLowerCase();
      if (rutA < rutB) {
        return this.ordenAscendenteRut ? -1 : 1;
      }
      if (rutA > rutB) {
        return this.ordenAscendenteRut ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteRut = !this.ordenAscendenteRut;
  }

  ordenarPorDireccion(): void {
    this.profesionales.sort((a: any, b: any) => {
      const direccionA = a.direccion.toLowerCase();
      const direccionB = b.direccion.toLowerCase();
      if (direccionA < direccionB) {
        return this.ordenAscendenteDireccion ? -1 : 1;
      }
      if (direccionA > direccionB) {
        return this.ordenAscendenteDireccion ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteDireccion = !this.ordenAscendenteDireccion;
  }

  ordenarPorTelefono(): void {
    this.profesionales.sort((a: any, b: any) => {
      const telefonoA = a.telefono.toLowerCase();
      const telefonoB = b.telefono.toLowerCase();
      if (telefonoA < telefonoB) {
        return this.ordenAscendenteTelefono ? -1 : 1;
      }
      if (telefonoA > telefonoB) {
        return this.ordenAscendenteTelefono ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteTelefono = !this.ordenAscendenteTelefono;
  }

  ordenarPorEmail(): void {
    this.profesionales.sort((a: any, b: any) => {
      const emailA = a.email.toLowerCase();
      const emailB = b.email.toLowerCase();
      if (emailA < emailB) {
        return this.ordenAscendenteEmail ? -1 : 1;
      }
      if (emailA > emailB) {
        return this.ordenAscendenteEmail ? 1 : -1;
      }
      return 0;
    });
    this.ordenAscendenteEmail = !this.ordenAscendenteEmail;
  }

  cambiarPagina(valor: number): void {
    this.inicio += valor;
  }

  onSubmit(): void {
    // Aquí puedes manejar la lógica cuando se envía el formulario
  }

  invitar(): void {
    
    this._profesionalService.enviarInvitacion(this.emailForm.value).subscribe({
      next: (res) => {
        console.log("funciono")
        this.toastService.showSuccess("Invitación enviada");
      },
      error: (res) => {
        // Manejar el error si es necesario
      }
    });
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
    this.cambiarpass = false;
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

  onTelefonoInput(event: any) {
    let telefono = event.target.value.replace(/[^\d]/g, '');
    telefono = telefono.substring(0, 9);
    this.profesionalForm.patchValue({ telefono: telefono });
  }

  cambiarContrasena() {
    this.mostrarInformacion = false;
    this.cambiarpass = true;
  }

  nuevapass() {
    const newpass = this.passwordForm.get('newpass')?.value;
    this._authService.nuevaContraseña(this.profesional.id, newpass).subscribe(
      respuesta => {
        this.toastService.showSuccess(respuesta.message);
      },
    );
  }
}
