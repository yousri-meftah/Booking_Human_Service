import React from 'react'

import Menubar from './Menubar'
import DropdownMenuDemo  from './dropdownmenu'
function NavBar({ ok}: { ok: boolean }){
  return (
    <>
    <div className={"container border-b border-gray p-5 flex justify-between"}   >
        <Menubar />
        <DropdownMenuDemo islog={ok}/>
    </div>
    </>
  )
}

export default NavBar