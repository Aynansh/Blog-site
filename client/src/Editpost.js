import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "./Editor";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Editpost() {
  const { id } = useParams();
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [content, setcontent] = useState("");
  const [files, setfiles] = useState("");
  //   const [redirect, setredirect] = useState(false);
  const [url, seturl] = useState("");
  const [loading, setloading] = useState(false);
  //   const [cover,setcover]=useState("");
  const [redirect, setredirect] = useState(false);
  const notify = () =>
    toast.success("Loading", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      className: "toast-message",
    });

  useEffect(() => {
    fetch("http://localhost:4000/post/" + id).then((response) => {
      response.json().then((postinfo) => {
        settitle(postinfo.title);
        setsummary(postinfo.summary);
        setcontent(postinfo.content);
        seturl(postinfo.cover);
      });
    });
  }, []);

  const uploadimage = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setloading(true);
      notify();
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("upload_preset", "nwth3smu");

      try {
        const response = await Axios.post(
          "https://api.cloudinary.com/v1_1/dtv1jduoc/image/upload",
          form
        );

        seturl(response.data.url);
        console.log(response.data.url);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      } finally {
        setloading(false);
        toast.dismiss(); 
      }
    }
  };

  function updatepost(e) {
    e.preventDefault();
    const data=new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    data.append("url", url); 
    data.append("id",id);
    fetch('http://localhost:4000/post',{
        method:'PUT',
        body:data,
        credentials:'include',
    })
    setredirect(true);
  }
  if (redirect) {
    return <Navigate to={"/post/"+id} />;
  }
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <form onSubmit={updatepost}>
        <Input
          type="title"
          label="Title"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => settitle(e.target.value)}
        />
        <Input
          type="summary"
          label="Summary"
          placeholder="Enter Summary"
          value={summary}
          onChange={(e) => setsummary(e.target.value)}
        />
        <Input type="file" onChange={uploadimage} />
        {/* {loading && <CircularProgress color="success" label="Loading..." />} */}
        <Editor value={content} onChange={setcontent} />
        <button style={{ marginTop: "10px" }}>Update post</button>
      </form>
    </div>
  );
}
