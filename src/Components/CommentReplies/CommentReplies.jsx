import dayjs from "dayjs";

function getReplies(data) {
  return data?.data?.replies
    ?? data?.data?.data?.replies
    ?? data?.replies
    ?? (Array.isArray(data) ? data : []);
}

export default function CommentReplies({ data, isLoading }) {
  const replies = getReplies(data);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading replies...</p>;
  }

  if (!replies.length) {
    return <p className="text-sm text-gray-500">No replies yet.</p>;
  }

  return (
    <div className="mt-3 space-y-2">
      {replies.map((reply) => {
        const creator = reply?.commentCreator ?? reply?.user ?? {};
        const replyId = reply?._id ?? reply?.id;
        const createdAt = reply?.createdAt ?? reply?.created_at;

        return (
          <div className="rounded-xl bg-gray-100 p-2 text-sm" key={replyId}>
           <div className="flex items-baseline gap-1">
             <img src={creator?.photo} alt="" className="size-8" />
            <strong>{creator?.name ?? "Social user"}</strong>
           </div>
            <p>{reply?.content ?? ""}</p>
            {createdAt && (
              <time className="text-xs text-gray-500">
                {dayjs(createdAt).fromNow()}
              </time>
            )}
          </div>
        );
      })}
    </div>
  );
}
