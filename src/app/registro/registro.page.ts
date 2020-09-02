import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf-validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formRegistro: FormGroup;

  public mensagens_validacao = {
    nome: [
      {tipo: 'required', mensagem:'O campo nome é obrigatório!'},
      {tipo: 'minlength', mensagem: 'O nome deve ter pelo menos 3 caracteres!'}
    ],
    cpf: [
      {tipo: 'required', mensagem:'O campo CPF é obrigatório!'},
      {tipo: 'minlength', mensagem: 'O CPF deve ter pelo menos 11 caracteres!'},
      {tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 caracteres!'},
      {tipo: 'invalido', mensagem: 'CPF inválido!'}
    ],
    dataNasc: [
      {tipo: 'required', mensagem:'A data de nascimento é obrigatória!'},
    ],
    genero: [
      {tipo: 'required', mensagem:'O campo gênero é obrigatório!'},
    ],
    celular: [
      {tipo: 'minlength', mensagem: 'O celular deve ter pelo menos 10 caracteres!'},
      {tipo: 'maxlength', mensagem: 'O celular deve ter no máximo 16 caracteres!'}
    ],
    email: [
      {tipo: 'required', mensagem:'O campo E-mail é obrigatório!'},
      {tipo: 'email', mensagem: 'E-mail inválido!'}
    ],
    senha: [
      {tipo: 'required', mensagem: 'O campo senha é obrigatório'},
      {tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres!'}
    ],
    confirmaSenha: [
      {tipo: 'required', mensagem: 'O campo confrimar é obrigatório'},
      {tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres!'},
      {tipo: 'comparacao', mensagem: 'Deve ser igual a senha!'}
    ]
  }

  constructor(private formBuilder: FormBuilder,
     private router: Router,
     private usuariosService: UsuariosService,
     public alertController: AlertController) { 


    this.formRegistro = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([
       Validators.required,
       Validators.minLength(11),
       Validators.maxLength(14),
       CpfValidator.cpfValido
      ])],
      dataNasc: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmaSenha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],

    }, {
      validator: ComparacaoValidator('senha','confirmaSenha')
    });
  }

  async ngOnInit() {
    await this.usuariosService.buscarTodos();
    console.log(this.usuariosService.listaUsuarios);
  }
  
  public registro(){
    if(this.formRegistro.valid){
      console.log('formulário válido!')
    } else {
      console.log('formulário inválido!')
    }
  }

  public async salvarFormulario(){
    if(this.formRegistro.valid){

      let usuario = new Usuario();
      usuario.nome = this.formRegistro.value.nome;
      usuario.cpf = this.formRegistro.value.cpf;
      usuario.dataNascimento = new Date(this.formRegistro.value.dataNasc);
      usuario. genero = this.formRegistro.value.genero;
      usuario.celular = this.formRegistro.value.celular;
      usuario.email = this.formRegistro.value.email;
      usuario.senha = this.formRegistro.value.senha;

      if(await this.usuariosService.salvar(usuario)){
        this.exibirAlerta('SUCESSO!', 'Usuário salvo com sucesso!');
        this.router.navigateByUrl('/login');
      }else{
        this.exibirAlerta('ERRO!', 'Erro ao salvar o usuário!');
      }

    }else{
      this.exibirAlerta('ADVERTENCIA!', 'Formulário inválido</br> Verifique os campos dos seu formulário');
    }
}
async exibirAlerta(titulo: string, mensagem: string) {
  const alert = await this.alertController.create({
    header: titulo,
    message: mensagem,
    buttons: ['OK']
  });

  await alert.present();
}
}

