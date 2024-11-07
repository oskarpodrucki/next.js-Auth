'use client';
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
import { useState } from "react";
import PocketBase from 'pocketbase';

export function RegisterForm() {
    const pb = new PocketBase('http://172.16.15.151:8080');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleUsername = (e) => setUsername(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Hasła nie są zgodne");
            return;
        }

        const data = {
            username,
            email,
            emailVisibility: true,
            password,
            passwordConfirm: confirmPassword
        };

        try {
            const record = await pb.collection('users').create(data);
            console.log("Registration Data:", record);

            setIsRegistered(true);
            setError('');
        } catch (error) {
            console.log("Registration Error:", error);
            setError("Nie udało się zarejestrować");
        }
    };

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>Enter your details below to create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Your username"
                            required
                            onChange={handleUsername}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@example.com"
                            required
                            onChange={handleEmail}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Your password"
                            required
                            onChange={handlePassword}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            required
                            onChange={handleConfirmPassword}
                        />
                    </div>
                    <Button onClick={handleRegister} type="button" className="w-full">
                        Register
                    </Button>
                    {error && <p className="text-red-600 text-center">{error}</p>}
                    {isRegistered && <p className="text-green-600 text-center">Rejestracja zakończona sukcesem!</p>}
                </div>
            </CardContent>
        </Card>
    );
}
