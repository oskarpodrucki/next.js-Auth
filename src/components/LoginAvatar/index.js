'use client'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import PocketBase from 'pocketbase';
import { useEffect, useState } from "react";


export default function LoginAvatar({onLogin}) {

    const pb = new PocketBase('http://172.16.15.151:8080');

    const [user, setUser] = useState(null)

    useEffect(() => {
        setUser(pb.authStore.model)
    }, [])

    const login = async () => {
        try{
            const authData = await pb.collection('users').authWithPassword(
                'oskar',
                'zaq12wsx22',
            );
            console.log(authData)
            console.log(pb.authStore.isValid);
            console.log(pb.authStore.token);
            console.log(pb.authStore.model.id);

            setUser(pb.authStore.model)
            onLogin(pb.authStore.model)
        }catch(error){
            console.log(error)
        }finally{
            console.log("udało się")
        }
    }

    const logout = async () => {
        try{
            pb.authStore.clear();
            setUser(null)
            onLogin(null)
        }catch(error){
            console.log(error)
        }finally{
            console.log("wylogowano")
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex flex-row ">
                <Avatar className="cursor-pointer" onLogin={login}>
                    <AvatarImage src={pb.files.getUrl(user, user?.avatar)} alt="@shadcn" />
                    <AvatarFallback className="text-black">ADM</AvatarFallback>
                </Avatar>
                <div className="mt-2 ml-1">
                {user ? <p>zalogowany</p> : <p>niezalogowany</p>}
                </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Moje Konto</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {!user && 
                <Link href="../../login">
                <DropdownMenuItem>Login</DropdownMenuItem>
                </Link>
                }

                <Link href="../../registration">
                <DropdownMenuItem>Rejestracja</DropdownMenuItem>
                </Link>

                {user &&
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                }
                
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
