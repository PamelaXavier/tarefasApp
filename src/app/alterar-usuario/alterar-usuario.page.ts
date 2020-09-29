import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';
import { UsuariosService } from '../services/usuarios.service';
import { CpfValidator } from '../validators/cpf-validator';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {

  public formAlterar: FormGroup;

  public mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem: 'O campo nome é obrigatório!' },
      { tipo: 'minlength', mensagem: 'O nome deve ter pelo menos 3 caracteres!' }
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo CPF é obrigatório!' },
      { tipo: 'minlength', mensagem: 'O CPF deve ter pelo menos 11 caracteres!' },
      { tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 caracteres!' },
      { tipo: 'invalido', mensagem: 'CPF inválido!' }
    ],
    dataNasc: [
      { tipo: 'required', mensagem: 'A data de nascimento é obrigatória!' },
    ],
    genero: [
      { tipo: 'required', mensagem: 'O campo gênero é obrigatório!' },
    ],
    celular: [
      { tipo: 'minlength', mensagem: 'O celular deve ter pelo menos 10 caracteres!' },
      { tipo: 'maxlength', mensagem: 'O celular deve ter no máximo 16 caracteres!' }
    ],
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório!' },
      { tipo: 'email', mensagem: 'E-mail inválido!' }
    ]
  };

  private usuario: Usuario;

  private manterLogadoTemp: boolean;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    public alertController: AlertController) {


    this.formAlterar = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(14),
        CpfValidator.cpfValido
      ])],
      dataNasc: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])]

    });
    this.preencherFormulario();

  }

  ngOnInit() {

  }

  public async preencherFormulario() {
    this.usuario = await this.usuariosService.buscarUsuarioLogado();
    this.manterLogadoTemp = this.usuario.manterLogado;
    delete this.usuario.manterLogado;

    this.formAlterar.setValue(this.usuario);
    this.formAlterar.patchValue({ dataNasc: this.usuario.dataNascimento.toISOString() });
  }

  //Metodo salvar o novo usuario
  public async salvar() {
    if (this.formAlterar.valid) { // Faz a comparação e visualiza se o formulário é válido
      this.usuario.nome = this.formAlterar.value.nome; // Esses são os dados do usuário que serão salvos 
        this.usuario.dataNascimento = new Date (this.formAlterar.value.dataNasc);
          this.usuario.genero = this.formAlterar.value.genero;
            this.usuario.celular = this.formAlterar.value.celular;
              this.usuario.email = this.formAlterar.value.email;

          if( await this.usuariosService.alterar(this.usuario)) { // Chama o metodo alterar do usuario.service
            this.usuario.manterLogado = this.manterLogadoTemp; // Devolve  propriedade de manter logado que havia sido removida anteriormente
            this.usuariosService.salvarUsuarioLogado(this.usuario); // Faz com que o usuario logado possua os dados atuais que foram modificados
            this.exibirAlerta("SUCESSO!",  "Usuário alterado com sucesso!") // Mensagem de sucesso para o usuário saber que a alteracao foi efetuada
            this.router.navigateByUrl('/configuracoes') //Leva o usuario para a pagina configuracoes

          }
    } else { // Caso o formulário apresentado não seja válido haverá um aviso sobre isso
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
