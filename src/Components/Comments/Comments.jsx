import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { FiClock, FiHeart, FiMessageCircle, FiSend } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import getAllComments from "../../api/getAllComments.api";
import "./Comments.css";
import CreateComment from "../CreateComment";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button, DrawerTrigger, Dropdown, Label } from "@heroui/react";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";
import updateComment from "../../api/updateComment.api";
import { UserContext } from "../Context/UserContext";
import deleteComment from "../../api/deleteComment.api";
import Loading from "../Loading";
import { CiImageOn } from "react-icons/ci";
import { IoReloadSharp } from "react-icons/io5";
import like_unlike_comment from "../../api/like&unlikeComment.api";

dayjs.extend(relativeTime);

function getCommentUser(comment) {
  return comment?.commentCreator || {};
}

function getCommentText(comment) {
  return comment?.content || "";
}

function getUserName(user) {
  return user?.name || "Social user";
}

function CommentSkeleton() {
  return (
    <div className="comment-skeleton" aria-label="Loading comments">
      <span />
      <div>
        <i />
        <i />
      </div>
    </div>
  );
}

export default function Comments({ postId }) {
  const [likedComments, setLikedComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const { logedUserid } = useContext(UserContext);
  const querClient = useQueryClient();
  // console.log('mid',logedUserid);
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["postComments", postId],
    queryFn: () => getAllComments(postId),
    select: (response) => response?.data?.comments || [],
    enabled: Boolean(postId),
  });

  console.log(data);
  
   

  const {
    mutate,
    isPending,
    isError: updateCommIserror,
    error,
  } = useMutation({
    mutationFn: ({ postId, commentId, commentdata }) =>
      updateComment(postId, commentId, commentdata),
    onSuccess: () => {
      querClient.invalidateQueries({
        queryKey: ["postComments"],
      });
      setEditingComment(null);
    },
  });
  const {
    mutate: deleteComm,
    isPending: deleteCommPen,
    isError: deleteCommIserr,
    error: deleteCommErr,
  } = useMutation({
    mutationFn: ({ postId, commentId }) => deleteComment(postId, commentId),
    onSuccess: () => {
      console.log("deleted");
      querClient.invalidateQueries({
        queryKey: ["postComments"],
      });
    },
    onError: () => {
      console.log(deleteCommErr);
    },
  });

  function editComment(comm) {
    setEditingComment(comm._id);
    setEditedContent(comm.content || "");
    setEditedImage(null);
  }

  function saveEditedComment(commentId) {
    const formData = new FormData();
    formData.append("content", editedContent);
    if (editedImage) {
      formData.append("image", editedImage);
    }

    mutate({
      commentId,
      postId: postId,
      commentdata: formData,
    });
  }

  function deleComment(cId) {
    deleteComm({
      postId: postId,
      commentId: cId,
    });
  }

  const { mutate: like_unlike_comment_mutate, data: commentLikesData ,isPending:commentLikesPen } =
    useMutation({
      mutationFn:({pId,cId})=> like_unlike_comment(pId,cId),
      onSuccess: (commentLikesData) => {
        console.log("liked");
        console.log(commentLikesData);
        querClient.invalidateQueries({
          queryKey:['singlePost']
        })
        querClient.invalidateQueries({
          queryKey:['postComments']
        })
      },
    });

    console.log(commentLikesData);

    const likedCommentData=commentLikesData?.data?.data

     const toggleCommentLike = (postId,commentId) => {
      // setLikedComments((current) => ({ ...current, [commentId]: !current[commentId] }))
      like_unlike_comment_mutate({pId:postId,cId:commentId})
    }


  if(updateCommIserror) {
    return error.message;
  }

  

  return (
    <section className="comments-panel" aria-labelledby="comments-title">
      {deleteCommPen ? (
        <Loading />
      ) : (
        <>
          <div className="comments-panel__heading">
            <div>
              <p className="comments-panel__eyebrow">Join the conversation</p>
              <h2 id="comments-title">
                Comments <span>{data.length}</span>
              </h2>
            </div>
            <FiMessageCircle aria-hidden="true" />
          </div>

          {isLoading && (
            <div className="comments-list">
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </div>
          )}

          {isError && (
            <div className="comments-message" role="alert">
              We could not load the comments right now.
            </div>
          )}

          {!isLoading && !isError && data.length === 0 && (
            <div className="comments-message comments-message--empty">
              <FiMessageCircle aria-hidden="true" />
              <strong>Start the conversation</strong>
              <span>Be the first person to share a thought.</span>
            </div>
          )}

          {!isLoading && !isError && data.length > 0 && (
            <div className="comments-list">
              {data.map((comment, index) => {
                const user = getCommentUser(comment);
                const name = getUserName(user);
                const commentId = comment?._id;
                // const isLiked = Boolean(likedComments[commentId]);
                const likes = Number(
                  commentLikesData?.data?.data?.likesCount ,
                );
                const createdAt = comment?.createdAt || comment?.created_at;
                const isEditing = editingComment === commentId;

                return (
                  <article className="comment" key={commentId}>
                    <img
                      className="comment__avatar"
                      src={user?.photo || fallbackAvatar}
                    />
                    <div className="comment__content">
                      <div className="comment__bubble">
                        <div className="flex justify-between items-center py-2">
                          <strong>{name}</strong>
                          {logedUserid === comment.commentCreator._id && (
                            <Dropdown>
                              <DrawerTrigger>
                                <BsThreeDotsVertical className="cursor-pointer" />
                              </DrawerTrigger>
                              <Dropdown.Popover>
                                <Dropdown.Menu
                                  onAction={(key) =>
                                    console.log(`Selected: ${key}`)
                                  }
                                >
                                  <Dropdown.Item
                                    id="edit-file"
                                    textValue="Edit comment"
                                  >
                                    <button
                                      type="button"
                                      className="flex justify-between gap-3 items-center"
                                      onClick={() => {
                                        editComment(comment);
                                      }}
                                    >
                                      <Label className="text-black">
                                        Edit comment
                                      </Label>
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
                                        deleComment(commentId);
                                      }}
                                    >
                                      <Label className="text-black">
                                        Delete comment
                                      </Label>
                                      <FaRegTrashAlt className="text-red-500" />
                                    </button>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown.Popover>
                            </Dropdown>
                          )}
                        </div>
                        {isEditing ? (
                          <form
                            onSubmit={(event) => {
                              event.preventDefault();
                              saveEditedComment(commentId);
                            }}
                          >
                            {isPending ? (
                              <IoReloadSharp className="animate-spin" />
                            ) : (
                              <>
                                {" "}
                                <input
                                  value={editedContent}
                                  onChange={(event) =>
                                    setEditedContent(event.target.value)
                                  }
                                  aria-label="Edit comment"
                                  className="bg-red-400 rounded-2xl ps-2"
                                  autoFocus
                                />
                                <label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                      setEditedImage(
                                        event.target.files?.[0] || null,
                                      )
                                    }
                                    aria-label="Change comment image"
                                    hidden
                                  />
                                  <CiImageOn className="text-3xl cursor-pointer m-3" />
                                </label>
                                {editedImage && <span>{editedImage.name}</span>}
                                <div className="flex gap-3 py-3">
                                  <button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-blue-400 px-3 rounded-2xl text-white cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingComment(null)}
                                    className="bg-red-400  rounded-2xl text-white cursor-pointer px-3"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </>
                            )}
                          </form>
                        ) : (
                          comment.content && (
                            <p className="bg-slate-200 p-2 rounded-2xl">
                              {getCommentText(comment)}
                            </p>
                          )
                        )}

                        {comment.image && (
                          <img
                            src={comment.image}
                            alt=""
                            className="size-50 rounded-2xl m-2"
                          />
                        )}
                      </div>
                      <div className="comment__meta">
                        <span>
                          <FiClock aria-hidden="true" />{" "}
                          {createdAt ? dayjs(createdAt).fromNow() : "Just now"}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCommentLike(postId,commentId)}
                        >
                          <FiHeart aria-hidden="true" 
                          className={comment?.likes?.includes(logedUserid) ? "text-red-400" : ""}
                           />{" "}
                        </button>

                        {comment?.likes.length}

                        <button type="button">
                          <FiMessageCircle aria-hidden="true" /> Reply
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          <CreateComment postId={postId} />
        </>
      )}
    </section>
  );
}
