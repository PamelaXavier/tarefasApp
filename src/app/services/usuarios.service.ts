import { Injectable } from '@angular/core';
import { ArmazenamentoService } from './armazenamento.service';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public listaUsuarios = [];

  constructor(private armazenamentoService: ArmazenamentoService) { }

  public async buscarTodos(){
    this.listaUsuarios = await this.armazenamentoService.pegarDados('usuarios');

    if(!this.listaUsuarios){
      this.listaUsuarios = [];
    }
  }

  public async salvar(usuario: Usuario){
    await this.buscarTodos();

    if(!usuario) {
      return false;
    }

    if(!this.listaUsuarios){
      this.listaUsuarios = [];
    }

    this.listaUsuarios.push(usuario); //o 'push' incluí um novo usuário no array

    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios);

  }

  public async login(email: string, senha: string){
    let usuario: Usuario;

    await this.buscarTodos();

    const listaTemporaria = this.listaUsuarios.filter(usuarioArmazenado =>{
      return (usuarioArmazenado.email == email && usuarioArmazenado.senha == senha);
    } ); // esse método retorna um array;

    if(listaTemporaria.length > 0) {
      usuario = listaTemporaria.reduce(item => item);
    }

    return usuario;
  }

  public salvarUsuarioLogado(usuario: Usuario){
    delete usuario.senha;
    this.armazenamentoService.salvarDados('usuarioLogado', usuario);
  }

  public async buscarUsuarioLogado(){
    return await this.armazenamentoService.pegarDados('usuarioLogado');
  }

  public async removerUsuarioLogado() {
    return await this.armazenamentoService.removerDados('usuarioLogado');
  }

  //Método de alterar o usuário
  public async alterar(usuario: Usuario) {
    if(!usuario) { //Teste para saber se o usuario e valido
      return false;
    } 
    await this.buscarTodos(); // Atualizacao da lista de usuarios dentro do storage

    const index = this.listaUsuarios.findIndex(usuarioArmazenado =>{
      return usuarioArmazenado.email ==  usuario.email;
    }); // Forma de saber a posicao do usuario dentro do array de usuarios

    const usuarioTemporario = this.listaUsuarios[index] as Usuario; // Maneira de armazenar a senha do usuario mesmo sem ela ser chamada na alteracao

    usuario.senha = usuarioTemporario.senha; // Recuperacao da senha do usuario antigo para o usuario novo, que foi alterado

    this.listaUsuarios[index] = usuario; // Devolve  os dados do usuario novo no mesmo lugar onde estavam o do antigo que foi modificado

    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios); // Esses sao os dados que serao enviados para o 'alterar - usuario'
  }
}
