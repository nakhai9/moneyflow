import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faQuestion } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react'
import Dialog from "../dialog/Dialog";
import { IRoute, OPTIONS_MENU_ON_APPBAR } from "@/common/constants/routes";
import { useRouter } from "next/router";

type DefaultLayoutProps = {
  children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {

  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>({
    id: 1,
    name: "Khai Dat",
    photoUrl: ""
  });

  const [isToggle, setIsToggle] = useState<boolean>(false);


  const toggleContextMenu = () => {
    setIsToggle(!isToggle);
  }

  const selectMenuItem = (path: string) => {
    router.push(path);
  }

  return <>
    <Dialog />
    <div className='vdt-w-100 vdt-h-screen'>
      <div className='vdt-h-14 vdt-bg-green-500 vdt-flex vdt-justify-center vdt-items-center'>
        <div className='vdt-container vdt-flex vdt-justify-between vdt-items-center'>
          <div className="vdt-flex-1">
            <button type="button" className="vdt-text-white vdt-text-sm vdt-text-semibold"> <FontAwesomeIcon icon={faPlus} className="" /> Add transaction </button>
          </div>
          <div className='vdt-relative'>
            <div onClick={toggleContextMenu} className="vdt-flex vdt-items-center vdt-space-x-4 vdt-cursor-pointer">
              <span className="vdt-text-white vdt-font-semibold vdt-text-sm">{currentUser.name}</span>
              <div className='vdt-w-10 vdt-h-10 vdt-bg-white vdt-overflow-hidden vdt-rounded-full'></div>
            </div>
            {
              isToggle && OPTIONS_MENU_ON_APPBAR && <ul className="vdt-absolute vdt-rounded vdt-w-32 vdt-left-0 vdt-bg-white vdt-border vdt-z-10 vdt-top-14 vdt-text-sm">
                {
                  OPTIONS_MENU_ON_APPBAR.map((item: IRoute, index: number) => (
                    <li key={index} onClick={() => { selectMenuItem(item.path) }} className="vdt-text-slate-500 vdt-px-3 vdt-py-2 vdt-cursor-pointer hover:vdt-bg-zinc-100">{item.text}</li>
                  ))
                }
              </ul>
            }
          </div>
        </div>
      </div>
      <main style={{ height: `calc(100vh - 56px)` }} className='vdt-overflow-hidden vdt-bg-white-lilac'>
        {children}
      </main>
    </div>
  </>
}

export default DefaultLayout;