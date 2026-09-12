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
import { Link } from "react-router-dom";
import { DrawerTrigger, Dropdown, Label, Modal, ModalTrigger } from "@heroui/react";
import { FaBookmark, FaImage, FaPen, FaRegTrashAlt } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import CreateComment from "../CreateComment";
import usePostCard from "../../Hooks/usePostCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookMark_unBookMark from "../../api/bookMark_unBookMark.api";
import follow_unfollow_user from "../../api/follow&unfollow.api";
import Swal from "sweetalert2";
import sharePostApi from "../../api/sharePostApi.api";
import { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";

dayjs.extend(relativeTime);

function getUserId(user) {
  return typeof user === "object" ? user?._id ?? user?.id : user;
}

function isFollowing(followingArr, userId) {
  return followingArr?.some((followingUser) => getUserId(followingUser) === userId);
}

export default function PostCard({ post, followingArr, sharedBy }) {
  const { logedUserid } = useContext(UserContext);
  const [shareCapModal, setShareCapModal] = useState(false)
  const [caption, setCaption] = useState('')
  const isSharedPost = Boolean(post?.isShare || post?.sharedPost || sharedBy);
  const originalPost = isSharedPost ? post?.sharedPost ?? post : post;
  const shareCaption = isSharedPost && originalPost !== post ? post?.body : "";
  const activePost = isSharedPost ? post : originalPost;
  const postOwner = activePost?.user ?? post?.user;
  const originalAuthor = originalPost?.user ?? null;
  const {
    authorName,
    avatar,
    postImage,
    comments,
    createdAt,
    isOwner,
    likeState,
    isLikePending,
    likePost,
    deletePost,
    startEditing,
    handleSubmit,
    register,
    sendUpdates,
    handleImagePreview,
    imgPreview,
    setImgPreview,
    isEditModalOpen,
    setIsEditModalOpen,
    showCommentForm,
    setShowCommentForm,
  } = usePostCard(activePost);

  const queryClient = useQueryClient();
  const sharerName = sharedBy?.name || sharedBy?.userName || "Someone";
  const sharerAvatar = sharedBy?.photo || "https://ui-avatars.com/api/?name=User";
  const originalAuthorId = originalAuthor?._id ?? originalAuthor?.id;
  const currentUserId = typeof logedUserid === "object"
    ? logedUserid?._id ?? logedUserid?.id
    : logedUserid;
  const isOriginalAuthorOwner = originalAuthorId === currentUserId;
  const { mutate } = useMutation({
    mutationFn: (id) => bookMark_unBookMark(id),
    onSuccess: () => {
      console.log("booked");
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });

  const { mutate: follow_unfollow, data: followingData } = useMutation({
    mutationFn: (id) => follow_unfollow_user(id),
    onSuccess: (followingData) => {
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myPosts"],
      });
      // console.log('followed');
      // console.log(followingData);
      // console.log('following array',followingArr);
    },
  });

  const { mutate: sharePostMutate } = useMutation({
    mutationFn: ({ id, body }) => sharePostApi(id, { body }),
    onSuccess: () => {
      setCaption("");
      setShareCapModal(false);
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      Swal.fire({
        title: "shared!",
        icon: "success",
      });
    },
    onError: () => {
      Swal.fire({
        title: "Couldn't share this post",
        icon: "error",
      });
    },
  });


  function handleShareSubmit(event) {
    event.preventDefault();

    if (!caption.trim()) {
      Swal.fire({
        title: "Add a caption before sharing",
        icon: "warning",
      });
      return;
    }

    const targetPostId = originalPost?._id ?? post?._id;
    sharePostMutate({ id: targetPostId, body: caption.trim() });
  }

  return (
    <>
      <article className="post-card relative">
        <header className="post-card__header">
          <img
            className="post-card__avatar"
            src={avatar}
            alt={`${authorName}'s avatar`}
          />
          <div className="post-card__author">
            {isOwner ? (
              <strong>{authorName}</strong>
            ) : (
              <strong className="flex gap-4">
                {authorName}{" "}
                <p
                  className="bg-slate-400 rounded-2xl px-2 cursor-pointer hover:bg-slate-300"
                  onClick={() => follow_unfollow(postOwner?._id)}
                >
                  {isFollowing(followingArr, getUserId(postOwner))
                    ? "Following"
                    : "Follow"}
                </p>
              </strong>
            )}
            <span>
              {isSharedPost ? (
                <>
                  <FiShare2 aria-hidden="true" /> {sharerName} shared this post
                </>
              ) : (
                <>
                  <FiClock aria-hidden="true" />{" "}
                  {createdAt ? dayjs(createdAt).fromNow() : "Just now"}
                </>
              )}
            </span>
          </div>
          {isOwner ? (
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
                          startEditing();
                        }}
                        type="button"
                        className="flex justify-between gap-3 items-center"
                      >
                        <Label className="text-black">
                          {post?.isShare ? "Edit shared caption" : "Edit post"}
                        </Label>
                        <FaPen className="text-gray-500" />
                      </button>
                    </Dropdown.Item>

                    {post?.isShare && (
                      <Dropdown.Item
                        id="unshare-file"
                        textValue="Unshare post"
                        variant="danger"
                      >
                        <button
                          className="flex justify-between gap-3 items-center"
                          onClick={() => {
                            Swal.fire({
                              title: "Unshare this post?",
                              text: "This will remove the shared post from your feed.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, unshare",
                              cancelButtonText: "Cancel",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deletePost(post?._id ?? post?.id);
                              }
                            });
                          }}
                        >
                          <Label className="text-black">Unshare post</Label>
                          <FaRegTrashAlt className="text-red-500" />
                        </button>
                      </Dropdown.Item>
                    )}

                    {!post?.isShare && (
                      <Dropdown.Item
                        id="delete-file"
                        textValue="Delete comment"
                        variant="danger"
                      >
                        <button
                          className="flex justify-between gap-3 items-center"
                          onClick={() => {
                            deletePost(originalPost?._id ?? post?._id ?? post?.id);
                          }}
                        >
                          <Label className="text-black">Delete post</Label>
                          <FaRegTrashAlt className="text-red-500" />
                        </button>
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </span>
          ) : null}
        </header>
        {isSharedPost && shareCaption && (
          <div className="text-sm text-slate-700 pb-4 ps-6 border-b border-b-gray-600">
            <span className="font-medium"></span> {shareCaption}
          </div>
        )}


        {isSharedPost && originalAuthor && (
          <div className="flex items-center gap-2 px-3 pb-2 text-sm text-slate-600 mt-2">
            <img
              src={originalAuthor.photo || "https://ui-avatars.com/api/?name=User"}
              alt={`${originalAuthor.name || "Original author"}'s avatar`}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span>
              Originally posted by{" "}
              <strong>{originalAuthor.name || originalAuthor.userName || "Someone"}</strong>
            </span>
            {originalAuthorId && !isOriginalAuthorOwner && (
              <button
                type="button"
                className="bg-slate-400 rounded-2xl px-2 cursor-pointer hover:bg-slate-300"
                onClick={() => follow_unfollow(originalAuthorId)}
              >
                {isFollowing(followingArr, originalAuthorId) ? "Following" : "Follow"}
              </button>
            )}
          </div>
        )}

        <Link to={`/postdetailes/${originalPost?._id ?? post?._id}`}>
          {originalPost?.body && <p className="post-card__body">{originalPost.body}</p>}

          {originalPost?.image && (
            <div className="post-card__media rounded-2xl">
              <img src={originalPost.image} alt="Post attachment" loading="lazy" />
            </div>
          )}
        </Link>
        <div className="post-card__stats">
          <span
            className={
              likeState.isLiked ? "post-card__like-count is-liked" : ""
            }
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
            disabled={isLikePending}
            onClick={() => likePost()}
          >
            <FiHeart aria-hidden="true" /> Like
          </button>
          <button
            className="post-card__action"
            type="button"
            onClick={() => {
              setShowCommentForm((prev) => !prev);
            }}
          >
            <FiMessageCircle aria-hidden="true" /> Comment
          </button>
        

          <Modal isOpen={shareCapModal} onOpenChange={setShareCapModal}>
            <ModalTrigger>
                <button
            className="post-card__action"
            type="button"
            
          >
            <FiShare2 aria-hidden="true" /> Share
          </button>
            </ModalTrigger>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-90">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Add caption</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleShareSubmit}>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      type="text"
                      className="bg-slate-300 w-full rounded-2xl p-3 resize-none"
                      placeholder="Write something..."
                    ></textarea>

                    <button
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

          <button
            className="text-2xl cursor-pointer"
            type="button"
            aria-label="Save post"
            title="Save post"
            onClick={() => mutate(post?._id)}
          >
            {post.bookmarked ? (
              <FaBookmark />
            ) : (
              <FiBookmark aria-hidden="true" />
            )}
          </button>
        </div>
        <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-90">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>
                    {post?.isShare ? "Edit shared caption" : "Edit post"}
                  </Modal.Heading>
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
                      <input
                        {...register("image", { onChange: handleImagePreview })}
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
                          className="absolute top-2 cursor-pointer hover:text-red-400 right-0 text-3xl text-black"
                        />
                      )}
                      <img
                        src={imgPreview}
                        alt=""
                        className="rounded-2xl py-3"
                      />
                    </div>
                    <button
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


        

        {showCommentForm && (
          <div className=" bg-slate-700/5 flex justify-center items-center">
            <CreateComment
              postId={post?._id ?? post?.id}
              setShowCommentForm={setShowCommentForm}
            />
          </div>
        )}
      </article>
    </>
  );
}
