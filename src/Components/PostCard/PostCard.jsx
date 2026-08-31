import { useContext, useRef, useState } from "react";
import {
  FiBookmark,
  FiClock,
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiShare2,
} from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "./PostCard.css";
import { Link, useParams } from "react-router-dom";
import {
  DrawerTrigger,
  Dropdown,
  Label,
  Modal,
  ModalTrigger,
} from "@heroui/react";
import { FaImage, FaPen, FaRegTrashAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import delePostApi from "../../api/deletPost.api";
import { UserContext } from "../Context/UserContext";
import { useForm } from "react-hook-form";
import updatePostApi from "../../api/updatePost.api";
import { IoMdCloseCircle } from "react-icons/io";

dayjs.extend(relativeTime);

function getUser(post) {
  return post?.user;
}

function getUserName(user) {
  return user?.name;
}

export default function PostCard({ post }) {
  // console.log(post);

  const initialLikeCount = Number(post?.likesCount ?? 0);
  const initiallyLiked = Boolean(post?.isLiked || post?.liked);
  const [likeState, setLikeState] = useState({
    count: initialLikeCount,
    isLiked: initiallyLiked,
  });
  const [isSaved, setIsSaved] = useState(false);
  const author = getUser(post);
  const authorName = getUserName(author);
  const avatar = author?.photo;
  const postImage = post?.image;
  const comments = Number(post?.commentsCount ?? 0);
  const createdAt = post?.createdAt;
  const qc = useQueryClient();
  const { logedUserid } = useContext(UserContext);
  const [imgPreview, setImgPreview] = useState(null);
  const [modale2Opend, setModale2Opend] = useState(false);

  const {
    data,
    isPending,
    isError,
    mutate: delePostMutate,
  } = useMutation({
    mutationFn: (id) => delePostApi(id),
    onSuccess: () => {
      console.log("deleted");
      qc.invalidateQueries({
        queryKey: ["allPosts"],
      });
      qc.invalidateQueries({
        queryKey: ["myPosts"],
      });
    },
    onError: (error) => {
      console.error(
        "Unable to delete post:",
        error.response?.data || error.message,
      );
    },
  });

  const {
    data: updatePostData,
    isPending: penUpdate,
    isError: iserrorUpdate,
    mutate: upPostMutate,
  } = useMutation({
    mutationFn: ({ postId, upData }) => updatePostApi(postId, upData),
    onSuccess: () => {
      console.log("updated");
      qc.invalidateQueries({
        queryKey: ["allPosts"],
      });
      qc.invalidateQueries({
        queryKey: ["myPosts"],
      });
    },
    onError: (error) => {
      console.error(
        "Unable to update post:",
        error.response?.data || error.message,
      );
    },
  });

  function delePost(id) {
    console.log("deleting...");

    delePostMutate(id);
  }

  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  function editPost(post) {
    if (post.body) {
      setValue("body", post.body);
    }
    if (post.image) {
      setImgPreview(post.image);
    }
    console.log("checked");
  }
  const formData = new FormData();
  function sendUpdates(values) {
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
    upPostMutate({ postId: post._id, upData: formData });
  }
  function handleImgPreview(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const path = URL.createObjectURL(file);
    setImgPreview(path);
  }
  return (
    <article className="post-card">
      <header className="post-card__header">
        <img
          className="post-card__avatar"
          src={avatar}
          alt={`${authorName}'s avatar`}
        />
        <div className="post-card__author">
          <strong>{authorName}</strong>
          <span>
            <FiClock aria-hidden="true" />{" "}
            {createdAt ? dayjs(createdAt).fromNow() : "Just now"}
          </span>
        </div>
        {post.user._id === logedUserid ? (
          <span
            className="post-card__icon-button"
            type="button"
            aria-label="More post options"
            title="More options"
          >
            <Dropdown>
              <DrawerTrigger>
                <FiMoreHorizontal aria-hidden="true" />
              </DrawerTrigger>
              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={(key) => console.log(`Selected: ${key}`)}
                >
                  <Dropdown.Item id="edit-file" textValue="Edit comment">
                    <button
                      onClick={() => {
                        setModale2Opend(true);
                        editPost(post);
                      }}
                      type="button"
                      className="flex justify-between gap-3 items-center"
                    >
                      <Label className="text-black">Edit post</Label>
                      <FaPen className="text-gray-500" />
                    </button>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="delete-file"
                    textValue="Delete comment"
                    variant="danger"
                  >
                    <button
                      className="flex justify-between gap-3 items-center"
                      onClick={() => {
                        delePost(post?._id ?? post?.id);
                      }}
                    >
                      <Label className="text-black">Delete post</Label>
                      <FaRegTrashAlt className="text-red-500" />
                    </button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </span>
        ) : null}
      </header>

      <Link to={`/postdetailes/${post._id}`}>
        {post?.body && <p className="post-card__body">{post.body}</p>}

        {postImage && (
          <div className="post-card__media rounded-2xl">
            <img src={postImage} alt="Post attachment" loading="lazy" />
          </div>
        )}
      </Link>
      <div className="post-card__stats">
        <span
          className={likeState.isLiked ? "post-card__like-count is-liked" : ""}
        >
          <FiHeart aria-hidden="true" /> {likeState.count} likes
        </span>
        <span>{comments} comments</span>
      </div>

      <div className="post-card__actions">
        <button
          className={
            likeState.isLiked
              ? "post-card__action is-liked"
              : "post-card__action"
          }
          type="button"
          onClick={() =>
            setLikeState(({ count, isLiked }) => ({
              count: isLiked ? count - 1 : count + 1,
              isLiked: !isLiked,
            }))
          }
        >
          <FiHeart aria-hidden="true" /> Like
        </button>
        <button className="post-card__action" type="button">
          <FiMessageCircle aria-hidden="true" /> Comment
        </button>
        <button className="post-card__action" type="button">
          <FiShare2 aria-hidden="true" /> Share
        </button>
        <button
          className={
            isSaved
              ? "post-card__icon-button is-saved"
              : "post-card__icon-button"
          }
          type="button"
          aria-label="Save post"
          title="Save post"
          onClick={() => setIsSaved((saved) => !saved)}
        >
          <FiBookmark aria-hidden="true" />
        </button>
      </div>
      <Modal isOpen={modale2Opend} onOpenChange={setModale2Opend}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-90">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Edit post</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit(sendUpdates)}>
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
                    {
                      imgPreview&&
                    <IoMdCloseCircle onClick={()=>setImgPreview(null)} title="remove image" className="absolute top-2 cursor-pointer hover:text-red-400 right-0 text-3xl text-black"/>
                    }
                  <img src={imgPreview} alt="" className="rounded-2xl py-3" />
                  </div>
                  <button
                    onClick={() => {
                      setModale2Opend(false);
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
    </article>
  );
}
