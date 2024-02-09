'use client';   
import Image from "next/image"

import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { cn } from "@/lib/utils"
import { Icons } from "../../components/sections/loadingicon"
import { Button } from "../../components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {useState} from "react"
import { FormEvent } from "react"
export default function AuthenticationPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        


        console.log("submitted", email," password", password);
    }
  return (
    <main className={"flex min-h-screen flex-col items-center justify-between p-24"}>
        <Card className={cn("w-full lg:w-[650px]")}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                Enter your email and password below to Login
                </CardDescription>
            </CardHeader>
            <form  onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
        <Button variant="outline" >
            {<Icons.google className="mr-2 h-4 w-4" />
            }
            Gmail 
          </Button>
          <Button variant="outline">
           { <Icons.twitter className="mr-2 h-4 w-4" />
           }
            Twitter
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
        
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input  id="email" name="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="yousri@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}  type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">Login</Button>
      </CardFooter>
        </form>
    </Card>
     
    </main>
  )
}