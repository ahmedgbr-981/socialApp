import { Avatar, Button, Modal, ModalTrigger } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaImage, FaQq } from "react-icons/fa";
import createPost from "../api/createPost.api.js";
import { UserContext } from "./Context/UserContext.jsx";
import { IoMdCloseCircle } from "react-icons/io";

export default function CreatePost({ userPhoto: passedUserPhoto } = {}) {
  const { modaleOpend, setModaleOpend, userPhoto: contextUserPhoto } = useContext(UserContext);
  const displayUserPhoto = passedUserPhoto || contextUserPhoto;
  const [imgPreview, setImgPreview] = useState(null);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  const qClient = useQueryClient();
  const { data, mutate, isPending, isError, error } = useMutation({
    mutationFn: (postData) => createPost(postData),
    onSuccess: () => {
      console.log("post created");
      qClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      qClient.invalidateQueries({
        queryKey: ["myPosts"],
      });
      reset();
      setImgPreview(null);
    },
  });

  function getPostData(values) {
    const formData = new FormData();
    console.log("ok");
    if (!values.body && !values.image[0]) {
      return;
    }
    console.log("values", values);
    if (values.body) {
      formData.append("body", values.body);
    }
    if (values.image[0]) {
      formData.append("image", values.image[0]);
    }
    mutate(formData);
  }

  function handleImgPreview(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const path = URL.createObjectURL(file);
    setImgPreview(path);
  }

  return (
    <>
      <div className="w-full flex justify-center items-center gap-3 my-4">
        <Avatar>
          <Avatar.Image
            alt="User avatar"
            src={displayUserPhoto || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
          />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
        <Modal isOpen={modaleOpend} onOpenChange={setModaleOpend}>
          <ModalTrigger>
            <input
              type="text"
              className="w-full max-w-[520px] rounded-2xl bg-white p-2 text-black"
              readOnly
              placeholder="what's on your mind"
            />
          </ModalTrigger>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-90">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Create post</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleSubmit(getPostData)}>
                    <textarea
                      {...register("body")}
                      type="text"
                      className="bg-slate-300 w-full rounded-2xl p-3 resize-none"
                      placeholder="Write something..."
                    ></textarea>
                    <label>
                      {/* <input  {...register('image')} onChange={handleImgPreview} type="file" hidden/> */}
                      <input
                        {...register("image", { onChange: handleImgPreview })}
                        type="file"
                        accept="image/*"
                        hidden
                      />
                      <FaImage className="text-4xl cursor-pointer hover:text-slate-700" />
                    </label>
                    <div className="flex relative">

                    {imgPreview && (
                      <IoMdCloseCircle
                        onClick={() => setImgPreview(null)}
                       title="remove image"
                        className="absolute top-2 cursor-pointer text-black hover:text-red-400 right-0 text-3xl"
                      />
                    )}
                    <img src={imgPreview} alt="" className="rounded-2xl py-3" />
                    </div>
                    <button
                      onClick={() => {
                        setModaleOpend(false);
                      }}
                      type="submit"
                      className="text-black w-full bg-gray-600 rounded-2xl py-2 cursor-pointer"
                    >
                      Share
                    </button>
                  </form>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </>
  );
}
