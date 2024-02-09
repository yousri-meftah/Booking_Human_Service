import React from 'react'

import Menubar from './Menubar'
import DropdownMenuDemo  from './dropdownmenu'
function NavBar() {
  return (
    <>
    <div className={"container border-b border-gray p-5 flex justify-between"}   >
        <Menubar />
        <DropdownMenuDemo />
    </div>
    </>
  )
}

export default NavBar