'use client';

import PocketBase from 'pocketbase';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';
import Header from "@/components/Header";
import EditGame from '@/components/EditGame';


export default function Home() {
  const pb = new PocketBase('http://172.16.15.151:8080');
  
  const [data, setData] = useState(null);
  const [game, setGame] = useState({
    nazwa: "",
    opis: "",
    cena: "",
    wydawca: "",
    LikesUP: 0,
    LikesDOWN: 0
  });
  const [picture, setPicture] = useState(null);
  const [user, setUser] = useState(null)

  const login = (user_pb) => {
    setUser(user_pb)
  }

  useEffect(() => {
    setUser(pb.authStore.model)
  }, [])

  const form = (e, pickedValue) => {
    setGame((prev) => ({
      ...prev,
      [pickedValue]: e.target.value,
    }));
    console.log(game);
  };

  const savePicture = (e) => {
    console.log(e);
    setPicture(e.target.files[0]);
  };

  const save = async () => {
    const formData = new FormData();
    formData.append("nazwa", game.nazwa);
    formData.append("opis", game.opis);
    formData.append("cena", game.cena);
    formData.append("wydawca", game.wydawca);
    formData.append("zdjecie", picture);

    const record = await pb.collection('gry').create(formData);
    setData((prev) => [record, ...prev]);
  };

  const deleteItem = async (id) => {
    console.log(id);
    try {
      await pb.collection('gry').delete(id);
      setData((prev) => prev.filter(item => item.id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Usunięto rekord ;)");
    }
  };

  const updateItem = (item) => {
    console.log("update function");
    console.log(item);
    
    const updatedData = data.map((currentItem) => 
      currentItem.id === item.id ? item : currentItem
    );

    setData(updatedData);
  };

  const addLikeUP = async (id) => {
    try {
      const gameToUpdate = data.find(item => item.id === id);

      if (gameToUpdate) {
        const updatedLikes = gameToUpdate.LikesUP + 1;
        setData(prevData => prevData.map(item => 
          item.id === id ? { ...item, LikesUP: updatedLikes } : item
        ));
        await pb.collection('gry').update(id, { LikesUP: updatedLikes });
      }
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };
  
  const addLikeDOWN = async (id) => {
    try {
      const gameToUpdate = data.find(item => item.id === id);
      if (gameToUpdate) {
        const updatedLikesDown = gameToUpdate.LikesDOWN + 1;
        setData(prevData => prevData.map(item => 
          item.id === id ? { ...item, LikesDOWN: updatedLikesDown } : item
        ));
        await pb.collection('gry').update(id, { LikesDOWN: updatedLikesDown });
      }
    } catch (error) {
      console.error("Error adding dislike:", error);
    }
  };
  
  useEffect(() => {
    const getGames = async () => {
      try {
        const res = await pb.collection('gry').getFullList({ sort: '-created' });
        setData(res);
        console.log(res);
      } catch (error) {
        console.log(error);
      } finally {
        console.log("Pobrano giereczki ;)");
      }
    };
    getGames();
  }, []);

  return (
    <div className='w-full h-screen'>
      <Header login={login}/>
      <div className='flex flex-row gap-5 justify-center items-center w-full h-[70vh]'>
        {
          user ?
          data && data.map((ok, idx) => (
          <Card key={idx} className="flex flex-col justify-center items-center w-[300px] h-[500px]">
            <Image
              src={pb.files.getUrl(ok, ok.zdjecie)}
              width={150}
              height={150}
              alt={ok.nazwa}
              className='mt-5 w-[150px] h-[150px]'
            />
            <CardHeader>
              <CardTitle>{ok.nazwa}</CardTitle>
              <CardDescription>{ok.opis}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Cena: {ok.cena} ZŁ</p>
              <p>Wydawca: {ok.wydawca}</p>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="flex flex-row justify-center items-center gap-7 mt-5">
                <Button onClick={() => { addLikeUP(ok.id) }} variant="ghost">
                  <ThumbsUp color='green' /> {ok.LikesUP}
                </Button>
                <Button onClick={() => { addLikeDOWN(ok.id) }} variant="ghost">
                  <ThumbsDown color='red' /> {ok.LikesDOWN}
                </Button>
              </div>
              <div className="flex flex-row justify-center items-center gap-7 mt-10">
                <Button onClick={() => deleteItem(ok.id)} variant="ghost">
                  <Trash2 color='red' size={64} />
                </Button>
                <EditGame dane={ok} onUpdate={updateItem} />
              </div>
            </CardFooter>
          </Card>
        )) :
          <p>Nie jesteś zalogowany</p>
        }
      </div>
      <Separator className="mb-10" />
      <h1 className='text-3xl text-center mb-5'>DODAJ GRĘ:</h1>
      <div id="form" className='flex flex-row justify-center items-center gap-5'>
        <div className="w-[200px] items-center gap-1.5">
          <Label htmlFor="nazwa">Nazwa</Label>
          <Input onChange={(e) => form(e, "nazwa")} id="nazwa" placeholder="Nazwa" />
        </div>
        <div className="w-[200px] items-center gap-1.5">
          <Label htmlFor="opis">Opis</Label>
          <Input onChange={(e) => form(e, "opis")} id="opis" placeholder="Opis" />
        </div>
        <div className="w-[200px] items-center gap-1.5">
          <Label htmlFor="cena">Cena</Label>
          <Input onChange={(e) => form(e, "cena")} id="cena" placeholder="Cena" />
        </div>
        <div className="w-[200px] items-center gap-1.5">
          <Label htmlFor="wydawca">Wydawca</Label>
          <Input onChange={(e) => form(e, "wydawca")} id="wydawca" placeholder="Wydawca" />
        </div>
        <div className="w-[250px] items-center gap-1.5">
          <Label htmlFor="picture">Zdjęcie</Label>
          <Input onChange={(e) => savePicture(e)} id="picture" type="file" />
        </div>
        <Button onClick={save} type="submit" className="mt-6">Dodaj grę</Button>
      </div>
    </div>
  );
}
