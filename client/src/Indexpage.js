import { useEffect, useState } from 'react';
import Post from './Post'

export default function Indexpage(){
    const [posts,setposts]=useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setposts(posts);
            });
        });
    }, [])
    
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post}/>
            ))}
        </>
    );
}