import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Pencil } from "lucide-react";
import PocketBase from 'pocketbase';
import { useState } from "react";

export default function EditGame({ dane, onUpdate }) {
    const pb = new PocketBase('http://172.16.15.151:8080');
    
    const [game, setGame] = useState({
        nazwa: dane.nazwa,
        opis: dane.opis,
        cena: dane.cena,
        wydawca: dane.wydawca,
    });

    const form = (e, nazwa) => {
        setGame((prevGame) => ({
            ...prevGame,
            [nazwa]: e.target.value,
        }));
    };

    const update = async () => {
        const formData = new FormData();
        formData.append('nazwa', game.nazwa);
        formData.append('opis', game.opis);
        formData.append('cena', game.cena);
        formData.append('wydawca', game.wydawca);
        // formData.append('zdjecie', picture);

        try {
            const record = await pb.collection('gry').update(dane.id, formData);
            onUpdate(record);
        } catch (error) {
            console.error("Błąd podczas aktualizacji gry:", error);
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Button variant="ghost">
                        <Pencil color="green" size={64} />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <h1 className='text-3xl text-center mb-5'>EDYTUJ GRĘ:</h1>
                    <div id="form" className='flex flex-col justify-center items-center gap-5'>
                        <div className="w-[300px] items-center gap-1.5">
                            <Label htmlFor="nazwa">Nazwa</Label>
                            <Input onChange={(e) => form(e, "nazwa")} id="nazwa" defaultValue={dane.nazwa} placeholder="Nazwa" />
                        </div>
                        <div className="w-[300px] items-center gap-1.5">
                            <Label htmlFor="opis">Opis</Label>
                            <Input onChange={(e) => form(e, "opis")} id="opis" defaultValue={dane.opis} placeholder="Opis" />
                        </div>
                        <div className="w-[300px] items-center gap-1.5">
                            <Label htmlFor="cena">Cena</Label>
                            <Input onChange={(e) => form(e, "cena")} id="cena" defaultValue={dane.cena} placeholder="Cena" />
                        </div>
                        <div className="w-[300px] items-center gap-1.5">
                            <Label htmlFor="wydawca">Wydawca</Label>
                            <Input onChange={(e) => form(e, "wydawca")} id="wydawca" defaultValue={dane.wydawca} placeholder="Wydawca" />
                        </div>
                        <div className="w-[300px] items-center gap-1.5">
                            <Label htmlFor="picture">Zdjęcie</Label>
                            <Input onChange={(e) => savePicture(e)} id="picture" type="file" />
                        </div>
                        <Button onClick={update} type="button" className="mt-6">Zapisz zmiany</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
