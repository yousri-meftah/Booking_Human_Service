import React from 'react'
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
function CientForm() {
  return (
    <> 
        <div className="grid gap-2">
          <Label htmlFor="email">username</Label>
          <Input id="email" type="email" placeholder="yousri" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="yousri@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Confirme Password</Label>
          <Input id="password" type="password" />
        </div>
    </>
  )
}

export default CientForm