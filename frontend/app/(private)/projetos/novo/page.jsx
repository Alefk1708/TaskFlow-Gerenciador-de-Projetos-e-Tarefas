export default function NovoProjetoPage() {
  return (
    <div className="w-full h-full">
      <div className=" w-full h-[9vh]  flex flex-row justify-between items-center px-[2vw] ">
        <h1 className="text-[2vw] text-slate-600 font-semibold ">
          Novo projeto
        </h1>
      </div>
      <form
        action="/POST"
        className="w-[77%] h-[90%] px-[2vw] flex flex-col gap-[1.5vh]"
      >
        <p className="text-[1.4vw] ">Titulo</p>
        <input
          type="text"
          name="titulo"
          placeholder="Digite o titulo do projeto..."
          className="w-full h-[5vh] text-[1.2vw] border-[0.2vh] border-slate-400 rounded-[0.8vh] px-[0.5vw] outline-none "
        />
        <p>Descrição</p>
        <textarea
          type="text"
          name="titulo"
          placeholder="Digite a descrição do projeto..."
          className="w-full h-[18vh] text-[1.2vw] border-[0.2vh] border-slate-400 rounded-[0.8vh] px-[0.5vw] outline-none resize-none "
        />
        <p>Prioridade</p>
        <select
          name="priority"
          className="w-full h-[5vh] text-[1.2vw] border-[0.2vh] border-slate-400 rounded-[0.8vh] px-[0.5vw] outline-none"
        >
          <option disabled selected></option>
          <option value={"baixa"}>Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>

        <button
          className="
          w-[10vw] h-[6vh]
          bg-blue-600
          text-white
          rounded-[0.8vh]
          text-[1.2vw]
          font-medium
          hover:bg-blue-700
          transition-colors
        "
        >Criar Projeto</button>
      </form>
    </div>
  );
}
