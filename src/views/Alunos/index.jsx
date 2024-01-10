import "./alunos.css";
import { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';

export function Aluno() {
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [serie, setSerie] = useState('');
  const [alunos, setAlunos] = useState(() => {
    const storedAlunos = JSON.parse(localStorage.getItem('alunos')) || [];
    return storedAlunos;
  });

  const [editingAluno, setEditingAluno] = useState(null);

  const memoizedLocalStorage = useCallback(() => localStorage, []);

  useEffect(() => {
    memoizedLocalStorage().setItem('alunos', JSON.stringify(alunos));
  }, [alunos, memoizedLocalStorage]);

  const saveToLocalStorage = (e) => {
    e.preventDefault();

    if (editingAluno) {
      // Edit existing aluno
      const updatedAlunos = alunos.map((aluno) =>
        aluno.codigo === editingAluno.codigo
          ? { ...aluno, nome, sexo, serie }
          : aluno
      );
      setAlunos(updatedAlunos);
      setEditingAluno(null);
      toast("Aluno editado com sucesso");
    } else {
      // Add new aluno
      if (nome === "" || sexo === "" || sexo === "Selecione sexo" || serie === "") {
        toast("Preencha todos os campos antes de adicionar um novo aluno");
      } else {
        const newAluno = {
          codigo: (alunos.length + 1).toString().padStart(2, '0'),
          nome,
          sexo,
          serie
        };
        const updatedAlunos = [...alunos, newAluno];
        setAlunos(updatedAlunos);
        toast("Aluno adicionado com sucesso");
      }
    }

    setNome('');
    setSexo('');
    setSerie('');
  };

  return (
    <div className="container container-center">
      <div className="card mt-5">
        <div className="card-title">
          <h2>Matricula de Alunos</h2>
        </div>
        <div className="card-body">
          <div className="container">
            <form onSubmit={saveToLocalStorage}>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    className="form-control"
                    placeholder="nome"
                    onChange={(e) => setNome(e.target.value)}
                    value={nome}
                  />
                </div>
                <div className="col">
                  <label htmlFor="sexo">Sexo</label>
                  <select
                    className="form-control"
                    id="sexo"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                  >
                    <option value="">Selecione sexo</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="serie">Série</label>
                  <input
                    type="text"
                    id="serie"
                    className="form-control"
                    placeholder="serie"
                    value={serie}
                    onChange={(e) => setSerie(e.target.value)}
                  />
                </div>
                <div className="row mt-3">
                  <div className="col">
                    <button
                      type="submit"
                      className="btn btn-outline-success btn-form"
                    >
                      {editingAluno ? 'Editar' : 'Adicionar'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <table className="table table-striped table-bordered mt-5">
            <thead>
              <tr>
                <th width="100" className="text-center">Código</th>
                <th>Nome</th>
                <th width="100" className="text-center">Sexo</th>
                <th width="100" className="text-center">Série</th>
                <th width="200" className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.codigo}>
                  <td className="text-center">{aluno.codigo}</td>
                  <td>{aluno.nome}</td>
                  <td className="text-center">{aluno.sexo}</td>
                  <td className="text-center">{aluno.serie}</td>
                  <td className="text-center btn-table">
                    <div
                      className="btn btn-outline-warning"
                      onClick={() => setEditingAluno(aluno)}
                    >
                      Editar
                    </div>
                    <div
                      className="btn btn-outline-danger"
                      onClick={() => setAlunos(alunos.filter(a => a.codigo !== aluno.codigo))}
                    >
                      Apagar
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
