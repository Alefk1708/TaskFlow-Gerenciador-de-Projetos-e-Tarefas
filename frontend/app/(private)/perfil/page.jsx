"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Edit2, Save, X, LogOut, Camera } from "lucide-react";

export default function PerfilPage() {
  const router = useRouter();
  
  // Dados originais do usuário (vindos do banco)
  const [user, setUser] = useState(null);
  
  // Estado para controlar se está editando ou visualizando
  const [isEditing, setIsEditing] = useState(false);

  // Estado do formulário (o que o usuário digita)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Senha começa vazia (só preenche se quiser alterar)
  });

  const [loading, setLoading] = useState(true);

  // 1. Carregar dados
  useEffect(() => {
    async function userInfo() {
      try {
        const response = await fetch("api/auth/me");
        const data = await response.json();
        setUser(data);
        
        // Inicializa o formulário com os dados do usuário
        setFormData({
          name: data.name || "",
          email: data.email || "",
          password: "", 
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    userInfo();
  }, []);

  // 2. Função para salvar (Futura implementação)
  async function handleSave() {
    // AQUI VOCÊ VAI COLOCAR O FETCH PARA ATUALIZAR
    console.log("Dados para enviar:", formData);
    
    // Exemplo de lógica futura:
    /*
    await fetch("/api/user/update", {
        method: "PUT",
        body: JSON.stringify(formData)
    })
    */

    // Simulando sucesso:
    setUser({ ...user, name: formData.name, email: formData.email });
    setIsEditing(false); 
    setFormData(prev => ({ ...prev, password: "" })); // Limpa campo de senha
  }

  // 3. Cancelar edição
  function handleCancel() {
    setIsEditing(false);
    // Reseta o form para os dados originais
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    });
  }

  // Utilitário para iniciais
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) return <div className="p-[2vw]">Carregando...</div>;

  return (
    <div className="w-full h-full flex flex-col p-[2vw]">
      
      {/* CABEÇALHO */}
      <div className="w-full h-[8vh] flex items-center justify-between mb-[1vh]">
        <h1 className="text-[2vw] text-slate-600 font-semibold">Meu Perfil</h1>
        
        {/* Botão de Logout (Sempre visível) */}
        <button className="flex items-center gap-[0.5vw] text-red-500 hover:text-red-700 text-[1vw] font-medium transition-colors">
          <LogOut className="w-[1.2vw]" /> Sair
        </button>
      </div>

      {/* CARD PRINCIPAL */}
      <div className="
        w-full h-full 
        bg-white rounded-[1vh] shadow-sm 
        flex flex-col items-center p-[3vw] gap-[3vh]
        overflow-y-auto
      ">
        
        {/* ÁREA DA FOTO */}
        <div className="relative group cursor-pointer">
          <div className="
            w-[9vw] h-[9vw] 
            rounded-full 
            bg-blue-100 text-blue-600 
            flex items-center justify-center 
            text-[3vw] font-bold border-[0.3vw] border-slate-50
          ">
            {getInitials(user?.name)}
          </div>
          {/* Overlay de editar foto (Visual apenas) */}
          {isEditing && (
             <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-[2vw] h-[2vw]" />
             </div>
          )}
        </div>

        {/* FORMULÁRIO */}
        <div className="w-[40vw] flex flex-col gap-[2vh]">
          
          {/* Campo NOME */}
          <div className="flex flex-col gap-[0.5vh]">
            <label className="text-[1vw] font-medium text-slate-500 flex items-center gap-[0.5vw]">
               <User className="w-[1vw]" /> Nome Completo
            </label>
            <input 
              type="text"
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`
                w-full h-[6vh] px-[1vw] rounded-[0.8vh] border-[0.1vw] text-[1.1vw] outline-none transition-all
                ${isEditing 
                  ? "border-blue-400 bg-white text-slate-700 focus:ring-2 ring-blue-100" 
                  : "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                }
              `}
            />
          </div>

          {/* Campo EMAIL */}
          <div className="flex flex-col gap-[0.5vh]">
            <label className="text-[1vw] font-medium text-slate-500 flex items-center gap-[0.5vw]">
               <Mail className="w-[1vw]" /> E-mail
            </label>
            <input 
              type="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`
                w-full h-[6vh] px-[1vw] rounded-[0.8vh] border-[0.1vw] text-[1.1vw] outline-none transition-all
                ${isEditing 
                  ? "border-blue-400 bg-white text-slate-700 focus:ring-2 ring-blue-100" 
                  : "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                }
              `}
            />
          </div>

          {/* Campo SENHA (Só aparece editável se estiver no modo edição) */}
          <div className="flex flex-col gap-[0.5vh]">
            <label className="text-[1vw] font-medium text-slate-500 flex items-center gap-[0.5vw]">
               <Lock className="w-[1vw]" /> {isEditing ? "Nova Senha (Opcional)" : "Senha"}
            </label>
            <input 
              type="password"
              disabled={!isEditing}
              placeholder={isEditing ? "Deixe vazio para manter a atual" : "••••••••"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={`
                w-full h-[6vh] px-[1vw] rounded-[0.8vh] border-[0.1vw] text-[1.1vw] outline-none transition-all
                ${isEditing 
                  ? "border-blue-400 bg-white text-slate-700 focus:ring-2 ring-blue-100" 
                  : "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                }
              `}
            />
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex gap-[1vw] mt-[2vh]">
            {!isEditing ? (
              // MODO VISUALIZAÇÃO: Botão Editar
              <button 
                onClick={() => setIsEditing(true)}
                className="
                  w-full h-[6vh] 
                  bg-blue-600 text-white 
                  rounded-[0.8vh] 
                  flex items-center justify-center gap-[0.5vw]
                  text-[1.1vw] font-medium hover:bg-blue-700 transition-colors
                "
              >
                <Edit2 className="w-[1.2vw]" /> Editar Perfil
              </button>
            ) : (
              // MODO EDIÇÃO: Salvar e Cancelar
              <>
                <button 
                  onClick={handleCancel}
                  className="
                    flex-1 h-[6vh] 
                    bg-slate-100 text-slate-600 
                    rounded-[0.8vh] 
                    flex items-center justify-center gap-[0.5vw]
                    text-[1.1vw] font-medium hover:bg-slate-200 transition-colors
                  "
                >
                  <X className="w-[1.2vw]" /> Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="
                    flex-1 h-[6vh] 
                    bg-green-600 text-white 
                    rounded-[0.8vh] 
                    flex items-center justify-center gap-[0.5vw]
                    text-[1.1vw] font-medium hover:bg-green-700 transition-colors
                  "
                >
                  <Save className="w-[1.2vw]" /> Salvar Alterações
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}