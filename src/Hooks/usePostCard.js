import { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import delePostApi from "../api/deletPost.api";
import likePostApi from "../api/likePost.api";
import updatePostApi from "../api/updatePost.api";
import { UserContext } from "../Components/Context/UserContext";

function getUserId(user) {
  return typeof user === "object" ? user?._id ?? user?.id : user;
}

function hasUserLikedPost(post, user) {
  if (post?.isLiked !== undefined) return Boolean(post.isLiked);
  if (post?.liked !== undefined) return Boolean(post.liked);

  const currentUserId = getUserId(user);
  const likes = Array.isArray(post?.likes) ? post.likes : [];

  return likes.some((like) => getUserId(like?.user ?? like) === currentUserId);
}

export default function usePostCard(post) {
  const { logedUserid } = useContext(UserContext);
  const queryClient = useQueryClient();
  const postId = post?._id ?? post?.id;
  const author = post?.user;
  const [likeState, setLikeState] = useState({
    count: Number(post?.likesCount ?? 0),
    isLiked: hasUserLikedPost(post, logedUserid),
  });
  const [isSaved, setIsSaved] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    setLikeState({
      count: Number(post?.likesCount ?? 0),
      isLiked: hasUserLikedPost(post, logedUserid),
    });
  }, [post, logedUserid]);

  const invalidatePostQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    queryClient.invalidateQueries({ queryKey: ["singlePost", postId] });
  };

  const { mutate: deletePost } = useMutation({
    mutationFn: delePostApi,
    onSuccess: invalidatePostQueries,
    onError: (error) => {
      console.error(
        "Unable to delete post:",
        error.response?.data || error.message,
      );
    },
  });

  const { mutate: updatePost } = useMutation({
    mutationFn: ({ id, data }) => updatePostApi(id, data),
    onSuccess: invalidatePostQueries,
    onError: (error) => {
      console.error(
        "Unable to update post:",
        error.response?.data || error.message,
      );
    },
  });

  const {
    isPending: isLikePending,
    mutate: likePost,
  } = useMutation({
    mutationFn: () => likePostApi(postId),
    onMutate: () => {
      setLikeState(({ count, isLiked }) => ({
        count: isLiked ? count - 1 : count + 1,
        isLiked: !isLiked,
      }));
    },
    onSuccess: invalidatePostQueries,
    onError: (error) => {
      setLikeState(({ count, isLiked }) => ({
        count: isLiked ? count - 1 : count + 1,
        isLiked: !isLiked,
      }));
      console.error(
        "Unable to update post like:",
        error.response?.data || error.message,
      );
    },
  });

  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  function startEditing() {
    setValue("body", post?.body ?? "");
    setImgPreview(post?.image ?? null);
    setIsEditModalOpen(true);
  }

  function sendUpdates(values) {
    if (!values.body && !values.image?.[0]) return;

    const formData = new FormData();
    if (values.body) formData.append("body", values.body);
    if (values.image?.[0]) formData.append("image", values.image[0]);

    updatePost({ id: postId, data: formData });
    setIsEditModalOpen(false);
  }

  function handleImagePreview(event) {
    const file = event.target.files?.[0];
    if (file) setImgPreview(URL.createObjectURL(file));
  }

  return {
    authorName: author?.name,
    avatar: author?.photo,
    postImage: post?.image,
    comments: Number(post?.commentsCount ?? 0),
    createdAt: post?.createdAt,
    isOwner: getUserId(author) === getUserId(logedUserid),
    likeState,
    isLikePending,
    isSaved,
    setIsSaved,
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
  };
}
