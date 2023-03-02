class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor){
  this.ano = ano
  this.mes = mes
  this.dia = dia
  this.tipo = tipo
  this.descricao = descricao
  this.valor = valor
 }

  validarDados(){
    for(let i in this){
      if(this[i] === undefined || this[i] === '' || this[i] === null){
        return false
      }
      return true
    }
  }

}

class Bd{

  constructor(){
    let id = localStorage.getItem('id')
    if(id === null){
        localStorage.setItem('id', 0)
    }

  }

  getProximoId() {
    let proximoId = localStorage.getItem('id')//
    return parseInt(proximoId) + 1  
  }

  gravar(d) {   
    let id = this.getProximoId()
    localStorage.setItem(id, JSON.stringify(d))
    localStorage.setItem('id', id)
  }

  recuperarTodosRegistros() {
    let despesas = [];

    let id = localStorage.getItem('id');
    let despesa = ''

    for(let i = 1; i <= id; i++){
      let despesa = JSON.parse(localStorage.getItem(i));

      if(despesa === null){
        continue
      }
      despesa.id = i;
      despesas.push(despesa);    
    }
   return despesas
  }

  pesquisar(despesa){
    
    let despesasFiltradas = [];
    despesasFiltradas = this.recuperarTodosRegistros();
    

    if(despesa.ano != ''){
    despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }    
    if(despesa.mes != ''){
      despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes)
      }    
    if(despesa.dia != ''){
      despesasFiltradas =despesasFiltradas.filter((d) => d.dia == despesa.dia)
    }
    if(despesa.tipo != ''){
      despesasFiltradas =despesasFiltradas.filter((d) => d.tipo == despesa.tipo)
    }
    if(despesa.descricao != ''){
      despesasFiltradas = despesasFiltradas.filter((d) => d.descricao == despesa.descricao)
    }
    if(despesa.valor != ''){
      despesasFiltradas = despesasFiltradas.filter((d) => d.valor == despesa.valor)
    }

    return despesasFiltradas


  }

  remover(id){
    localStorage.removeItem(id)
  }
  
}


bd = new Bd();



function cadastrarDespesa(){
 let ano = document.getElementById('ano');
 let mes = document.getElementById('mes');
 let dia = document.getElementById('dia');
 let tipo = document.getElementById('tipo');
 let descricao = document.getElementById('descricao');
 let valor = document.getElementById('valor');

 
 let despesa = new Despesa(
  ano.value, 
  mes.value,
  dia.value,
  tipo.value,
  descricao.value, 
  valor.value
 )

 if(despesa.validarDados()){
 bd.gravar(despesa);

 document.getElementById('modal_titulo_div').className = 'modal-header text-success'; 
 document.getElementById('modal_titulo').innerHTML = 'Sucesso';
 document.getElementById('text_modal').innerHTML = 'Despesa cadastrada com sucesso';
 document.getElementById('modal_button').innerHTML = 'Voltar';
 document.getElementById('modal_button').className = 'btn btn success';
 $('#registraDespesa').modal('show');
 limparCampos()



} else{
  document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
  document.getElementById('modal_titulo').innerHTML = 'Erro na gravação';  
  document.getElementById('text_modal').innerHTML = 'Algum dos campos das despesas ficaram em branco';
  document.getElementById('modal_button').innerHTML = 'Voltar e corrigir';
  document.getElementById('modal_button').className = 'btn btn danger';
  $('#registraDespesa').modal('show')

  
};

}

//limpar campos - pode ser usada para adicionar
function limparCampos() {
  document.getElementById('mes').value = '';
  document.getElementById('dia').value = '';  
  document.getElementById('ano').value = '';
  document.getElementById('tipo').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
 }


function carregaListaDespesas(despesas = [], filtro = false){

  if(despesas.length == 0 && filtro == false){
  despesas =  bd.recuperarTodosRegistros();
  }
 let listaDespesas = document.querySelector("#lista_despesa");
 listaDespesas.innerHTML = ''
// colocar um modal de que não despesas cadsatradas
 despesas.forEach((d) => {

   let linha = listaDespesas.insertRow();
      linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        let tipo = parseInt(d.tipo)

        switch (tipo) {
          case 1 : tipo = 'alimentação'
           break
          case 2 : tipo = 'Educação'
           break
          case 3 : tipo = 'Lazer'
           break
          case 4 : tipo = 'Saúde'
           break
          case 5 : tipo = 'Transporte'
           break
          
        }
     
      linha.insertCell(1).innerHTML = `${tipo}`;

      linha.insertCell(2).innerHTML = `${d.descricao}`;
      linha.insertCell(3).innerHTML = `${d.valor}`;

      //exclusão

      let btn = document.createElement("button");
      btn.className = 'btn btn-danger'
      btn.innerHTML = '<i class="fas fa-times"></i>'
      btn.id = `id_despesa_${d.id}`
      btn.onclick = function (){

        id = this.id.replace('id_despesa_', '')
        bd.remover(id)

        window.location.reload()
      }
      linha.insertCell(4).append(btn)
 })
}


function pesquisarDespesa(){
 let ano = document.getElementById('ano').value;
 let mes = document.getElementById('mes').value;
 let dia = document.getElementById('dia').value;
 let tipo = document.getElementById('tipo').value;
 let descricao = document.getElementById('descricao').value;
 let valor = document.getElementById('valor').value;

 let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);


  let despesas = bd.pesquisar(despesa);
  carregaListaDespesas(despesas, true)
 

}


