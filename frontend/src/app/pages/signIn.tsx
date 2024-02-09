"use client"

import { Icons } from "../component/loadingicon"
import { Button } from "../../components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import ClientForm from "../component/CientForm"
import SocieteForm from "../component/SocieteForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"


export default function SignIn() {
    const [isClient, setisClient] = useState<boolean>(true)
    const handclient = () => {
        setisClient(true)
    }
    const handsociete = () => {
        setisClient(false)
    }
  return (
    <Card className={cn("w-[780px]")}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline" onClick={handclient}>
            {//<Icons.gitHub className="mr-2 h-4 w-4" />
            }
            Client 
          </Button>
          <Button variant="outline" onClick={handsociete}>
           { //<Icons.google className="mr-2 h-4 w-4" />
           }
            societe
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        {isClient ? <ClientForm /> : <SocieteForm />}
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
    </Card>
  )
}