"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Edit2, Save, X, Trash2Icon, Camera } from "lucide-react";

export default function PerfilPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function userInfo() {
      try {
        const response = await fetch("api/auth/me");
        const data = await response.json();
        setUser(data);

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

  async function userDelete() {
    try {
      const response = await fetch('api/user/delete', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar usuário");
      }

      const data = await response.json();
      console.log(data);

      router.push("/login");

    } catch (error) {
      console.log(error);
    }
  }

  async function handleSave() {
    try {
      const respose = await fetch("api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!respose.ok) {
        throw new Error("Erro ao atualizar usuário");
      }

      const data = await respose.json();
      console.log(data);

      setUser({ ...user, name: formData.name, email: formData.email });
      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.log(error);
    }
  }

  function handleCancel() {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    });
  }

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  if (loading) return <div className="p-[2vw]">Carregando...</div>;

  return (
    <div className="
      w-full h-full flex flex-col 
      /* MOBILE: Padding maior e espaço no final para o menu */
      p-[5vw] pb-[12vh]
      /* PC: Padding original */
      lg:p-[2vw] lg:pb-[2vw]
    ">
      
      {/* CABEÇALHO */}
      <div className="
        w-full 
        /* MOBILE: Altura maior */
        h-[6vh] mb-[2vh]
        /* PC: Altura original */
        lg:h-[8vh] lg:mb-[1vh]
        flex items-center justify-between
      ">
        <h1 className="
          text-slate-600 font-semibold
          /* MOBILE: Texto grande */
          text-[6vw]
          /* PC: Texto original */
          lg:text-[2vw]
        ">
          Meu Perfil
        </h1>

        {/* Botão de Deletar usuario */}
        <button
          onClick={() => {
            if(confirm("Tem certeza que deseja deletar sua conta?")) {
              userDelete()
            } else {
              return
            }
            
            
          }}
          className="
            flex items-center text-red-500 hover:text-red-700 font-medium transition-colors
            /* MOBILE: Gap e texto maiores */
            gap-[2vw] text-[3.5vw]
            /* PC: Gap e texto originais */
            lg:gap-[0.5vw] lg:text-[1vw]
          "
        >
          <Trash2Icon className="
            /* MOBILE: Icone grande */
            w-[4vw]
            /* PC: Icone original */
            lg:w-[1.2vw]
          " /> 
          Deletar usuário
        </button>
      </div>

      {/* CARD PRINCIPAL */}
      <div
        className="
          w-full h-full 
          bg-white shadow-sm flex flex-col items-center 
          overflow-y-auto
          
          /* MOBILE: Padding interno e arredondamento maior */
          rounded-[3vh] p-[5vw] gap-[4vh]
          /* PC: Original */
          lg:rounded-[1vh] lg:p-[3vw] lg:gap-[3vh]
        "
      >
        {/* ÁREA DA FOTO */}
        <div className="relative group cursor-pointer">
          <div
            className="
              rounded-full 
              bg-blue-100 text-blue-600 
              flex items-center justify-center 
              font-bold border-slate-50
              
              /* MOBILE: Foto grande (25vw) */
              w-[25vw] h-[25vw] text-[8vw] border-[1vw]
              /* PC: Foto original (9vw) */
              lg:w-[9vw] lg:h-[9vw] lg:text-[3vw] lg:border-[0.3vw]
            "
          >
            {getInitials(user?.name)}
          </div>
          
          {/* Overlay de editar foto */}
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-[8vw] h-[8vw] lg:w-[2vw] lg:h-[2vw]" />
            </div>
          )}
        </div>

        {/* FORMULÁRIO */}
        <div className="
          flex flex-col 
          /* MOBILE: Largura total e gap maior */
          w-full gap-[3vh]
          /* PC: Largura 40vw e gap original */
          lg:w-[40vw] lg:gap-[2vh]
        ">
          
          {/* Campo NOME */}
          <div className="flex flex-col gap-[0.5vh]">
            <label className="
              font-medium text-slate-500 flex items-center 
              /* MOBILE: Texto label grande */
              text-[4vw] gap-[2vw]
              /* PC: Texto original */
              lg:text-[1vw] lg:gap-[0.5vw]
            ">
              <User className="w-[4vw] lg:w-[1vw]" /> Nome Completo
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`
                w-full outline-none transition-all
                
                /* MOBILE: Input alto para toque */
                h-[7vh] px-[4vw] rounded-[2vh] text-[4vw] border-[0.3vh]
                /* PC: Input original */
                lg:h-[6vh] lg:px-[1vw] lg:rounded-[0.8vh] lg:text-[1.1vw] lg:border-[0.1vw]

                ${
                  isEditing
                    ? "border-blue-400 bg-white text-slate-700 focus:ring-2 ring-blue-100"
                    : "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                }
              `}
            />
          </div>

          {/* Campo EMAIL */}
          <div className="flex flex-col gap-[0.5vh]">
            <label className="
              font-medium text-slate-500 flex items-center 
              text-[4vw] gap-[2vw]
              lg:text-[1vw] lg:gap-[0.5vw]
            ">
              <Mail className="w-[4vw] lg:w-[1vw]" /> E-mail
            </label>
            <input
              type="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`
                w-full outline-none transition-all
                h-[7vh] px-[4vw] rounded-[2vh] text-[4vw] border-[0.3vh]
                lg:h-[6vh] lg:px-[1vw] lg:rounded-[0.8vh] lg:text-[1.1vw] lg:border-[0.1vw]
                ${
                  isEditing
                    ? "border-blue-400 bg-white text-slate-700 focus:ring-2 ring-blue-100"
                    : "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                }
              `}
            />
          </div>

          {/* Campo SENHA */}
          <div className="flex flex-col gap-[0.5vh]">
            <label className="
              font-medium text-slate-500 flex items-center 
              text-[4vw] gap-[2vw]
              lg:text-[1vw] lg:gap-[0.5vw]
            ">
              <Lock className="w-[4vw] lg:w-[1vw]" />{" "}
              {isEditing ? "Nova Senha (Opcional)" : "Senha"}
            </label>
            <input
              type="password"
              disabled={!isEditing}
              placeholder={
                isEditing ? "Deixe vazio para manter a atual" : "••••••••"
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={`
                w-full outline-none transition-all
                h-[7vh] px-[4vw] rounded-[2vh] text-[4vw] border-[0.3vh]
                lg:h-[6vh] lg:px-[1vw] lg:rounded-[0.8vh] lg:text-[1.1vw] lg:border-[0.1vw]
                ${
                  isEditing
                    ? "border-blue-400 bg-white text-slate-700 focus:ring-2 ring-blue-100"
                    : "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                }
              `}
            />
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="
            flex 
            /* MOBILE: Gap maior, margin top maior */
            gap-[3vw] mt-[4vh]
            /* PC: Original */
            lg:gap-[1vw] lg:mt-[2vh]
          ">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="
                  w-full bg-blue-600 text-white flex items-center justify-center font-medium hover:bg-blue-700 transition-colors
                  
                  /* MOBILE: Botão alto, texto grande */
                  h-[7vh] rounded-[2vh] gap-[2vw] text-[4vw]
                  /* PC: Original */
                  lg:h-[6vh] lg:rounded-[0.8vh] lg:gap-[0.5vw] lg:text-[1.1vw]
                "
              >
                <Edit2 className="w-[5vw] lg:w-[1.2vw]" /> Editar Perfil
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="
                    flex-1 bg-slate-100 text-slate-600 flex items-center justify-center font-medium hover:bg-slate-200 transition-colors
                    h-[7vh] rounded-[2vh] gap-[2vw] text-[4vw]
                    lg:h-[6vh] lg:rounded-[0.8vh] lg:gap-[0.5vw] lg:text-[1.1vw]
                  "
                >
                  <X className="w-[5vw] lg:w-[1.2vw]" /> Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="
                    flex-1 bg-green-600 text-white flex items-center justify-center font-medium hover:bg-green-700 transition-colors
                    h-[7vh] rounded-[2vh] gap-[2vw] text-[4vw]
                    lg:h-[6vh] lg:rounded-[0.8vh] lg:gap-[0.5vw] lg:text-[1.1vw]
                  "
                >
                  <Save className="w-[5vw] lg:w-[1.2vw]" /> Salvar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}