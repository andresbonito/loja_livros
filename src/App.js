import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [book, setBook] = useState({ id: '', titulo: '', edicao: '', autor: '' });
  const [books, setBooks] = useState([]);
  const [backendURL, setBackendURL] = useState('https://970ljim1x1.execute-api.us-east-1.amazonaws.com/lojaLivro');

  // useEffect(() => {
  //   obterLivros()
  // }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBook((prevBook) => ({ ...prevBook, [name]: value }));
  };


  const handleURLChange = (event) => {
    setBackendURL(event.target.value);
  };

  const obterLivros = async () => {
      const response = await axios.get(`${backendURL}/lojalivro`);
      setBooks(response.data);
  }

  const cadastrar = async () => {
    try {
      const response = await axios.post(`${backendURL}/lojalivro`, book);
      console.log(response.status)

      if (response.status === 200 || response.status === 201) {
        // Atualize a lista local de livros após o cadastro
        setBooks([...books, response.data]);
        // Limpe o estado do livro atual
        setBook({ id: '', titulo: '', edicao: '', autor: '' });
      } else {
        // Trate outros códigos de status conforme necessário
        console.error("Erro ao cadastrar o livro", response.data);
      }

    }
    catch (error) {
      console.error("Erro ao conectar com o back-end", error);
    }
  };

  const atualizar = async (id) => {

  };

  const remover = async (id) => {
    const newBooks = books.filter(b => b.id !== id);
    setBooks(newBooks);


  };

  const obterLivro = async (id) => {
    console.log('Oi')
    console.log(`${backendURL}/lojalivro/${id}`)
    console.log('Tchau')
    try {
      const response = await axios.get(`${backendURL}/lojalivro/${id}`);
      console.log(response.status)
      if (response.status === 200) {
        setBook({ id: response.data.id, titulo: response.data.titulo, edicao: response.data.edicao, autor: response.data.autor });
        console.log(JSON.stringify(response.data))
      } else {
        console.error('Erro ao buscar livros')
      }

    }
    catch (error) {
      console.error("Erro ao conectar com o back-end", error);
    }
  };

  return (
    <div className="App">
      <form>
        <input
          name="id"
          placeholder="ID"
          value={book.id}
          onChange={handleInputChange}
        />
        <input
          name="titulo"
          placeholder="Título"
          value={book.titulo}
          onChange={handleInputChange}
          disabled
        />
        <input
          name="edicao"
          placeholder="Descrição"
          value={book.edicao}
          onChange={handleInputChange}
          disabled
        />
        <input
          name="autor"
          placeholder="Autor"
          value={book.autor}
          onChange={handleInputChange}
          disabled
        />
        <button type="button" disabled onClick={cadastrar}>Cadastrar</button>
        <button type="button" disabled onClick={() => atualizar(book.id)}>Atualizar</button>
        <button type="button" disabled onClick={() => remover(book.id)}>Remover</button>
        <button type="button" onClick={() => obterLivro(book.id)}>Obter pelo id</button>
        <button type="button" onClick={() => obterLivros()}>Obter todos</button>
      </form>
      <input
        className="backend-url-input"
        type="text"
        placeholder="URL do Backend"
        value={backendURL}
        onChange={handleURLChange}
      />
      <ul>
    {books.map(b => (
      <li key={b.id}>
        <div className="book-box">
          <div className="titulo">{b.titulo}</div>
          <div className="autor">{b.autor}</div>
        </div>
      </li>
    ))}
</ul>

    </div>
  );
}

export default App;
