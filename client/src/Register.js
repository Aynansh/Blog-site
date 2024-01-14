import { useState } from "react";

export default function Register(){
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');

    async function register (e) {
        e.preventDefault();
        const response=await fetch('http://localhost:4000/register' , {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-type':'application/json'},
        });

        if(response.status !== 200){
            alert('Registration failed!');
        }
        else{
            alert('Registration successful!');
        }
    }
    return(
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" 
                   placeholder="Username" 
                   value={username}
                   onChange={e => setusername(e.target.value)}
            />
            <input type="password" 
                   placeholder="Password"
                   value={password}
                   onChange={e => setpassword(e.target.value)}
            />

            <button>Register</button>
        </form>
    );
}