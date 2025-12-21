import { CircleUserRoundIcon, FolderIcon, LayoutDashboardIcon } from "lucide-react"

export default function SideBar(){
    const links = [
        {name: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon/>},
        {name: "Projetos", href: "/projetos", icon: <FolderIcon/>},
        {name: "Perfil", href: "/perfil", icon: <CircleUserRoundIcon/>}

    ]
    return (
        <nav className="w-[20vw] h-[90vh] bg-slate-200 border-r-[0.15vh] border-slate-400">
            <ul>
                {
                    links.map((l, i) => (
                        <li key={i}>
                            
                        </li>
                    ))
                }
            </ul>
        </nav>
    )
}