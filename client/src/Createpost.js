import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@nextui-org/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Axios from "axios";
import { CircularProgress } from "@nextui-org/react";
import { Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Editor from "./Editor";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default function Createpost() {
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [content, setcontent] = useState("");
  const [files, setfiles] = useState("");
  const [redirect, setredirect] = useState(false);
  const [url, seturl] = useState("");
  const [loading, setloading] = useState(false);

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
        // console.log(title);
        // console.log(summary);
        // console.log(content);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      } finally {
        setloading(false);
        toast.dismiss(); // Close the loading toast
      }
    }
  };

  function logFormData(formData) {
    for (const entry of formData.entries()) {
      console.log(entry);
    }
  }

  async function createnewpost(e) {
    const data = new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    data.append("url", url); // Use the 'url' state variable here
    console.log(title);
    console.log(summary);
    console.log(content);
    console.log(url);
    logFormData(data);
    e.preventDefault();
    // console.log(files);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setredirect(true);
      // console.log(redirect);
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
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

      <form onSubmit={createnewpost}>
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
        <button style={{ marginTop: "10px" }}>Create post</button>
      </form>
    </div>
  );
}
