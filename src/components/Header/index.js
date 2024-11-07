import LoginAvatar from "../LoginAvatar"

export default function Header({ login }) {
    return (
        <div className="flex flex-row bg-black text-white p-2 items-center">
            <LoginAvatar onLogin={login}/>
            <h1 className="text-3xl text-center flex-grow ">Gry 🎮🎮</h1>
        </div>
    );
}
