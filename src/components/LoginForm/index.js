'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import PocketBase from 'pocketbase';

export function LoginForm() {
    const pb = new PocketBase('http://172.16.15.151:8080');
    const router = useRouter();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = (e) => setLogin(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const handleButton = async () => {
        console.log("Login:", login);
        console.log("Password:", password);

        try {
            const authData = await pb.collection('users').authWithPassword(login, password);
            console.log("Auth Data:", authData);
            console.log("Auth Valid:", pb.authStore.isValid);
            console.log("Token:", pb.authStore.token);
            console.log("User ID:", pb.authStore.model.id);

            // Przekierowanie po zalogowaniu
            router.push('/');
        } catch (error) {
            console.log("Login Error:", error);
            setError(true);
        } finally {
            console.log("Próba logowania zakończona");
        }
    };

    return (
        <>
            {pb.authStore.isValid ? (
                <p>Jesteś już zalogowany</p>
            ) : (
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>Enter your email below to login to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={handleLogin}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={handlePassword}
                                />
                            </div>
                            <Button onClick={handleButton} type="submit" className="w-full">
                                Login
                            </Button>
                            {error && <p className="text-red-600 text-center">Nie udało się zalogować</p>}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
