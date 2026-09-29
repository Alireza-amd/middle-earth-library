export type TComment = {
  parentId: string | null;
  id: string;
  createdAt: Date;
  content: string;
  likes: number;
  dislikes: number;
  spoiler: boolean;
  user: {
    name: string;
    id: string;
  };
  replies?: TComment[];
  depth?: number;
  repliedTo?: string;
  userLike?: boolean | null;
};

export function formatComments(comments: TComment[]) {
  const rootNodes: TComment[] = [];
  const nodes = new Map<string, TComment>(
    comments.map((comment) => [comment.id, { ...comment, replies: [] }]),
  );

  comments.forEach((comment) => {
    const commentNode = nodes.get(comment.id)!;
    if (comment.parentId) {
      const parentNode = nodes.get(comment.parentId);
      if (parentNode) {
        parentNode.replies!.push(commentNode!);
        commentNode.repliedTo = parentNode.user.name;
      }
    } else {
      rootNodes.push(commentNode);
    }
  });

  return addDepthToComments(rootNodes);
}

function addDepthToComments(comments: TComment[], depth = 0): TComment[] {
  return comments.map((comment) => ({
    ...comment,
    depth,
    replies: comment.replies
      ? addDepthToComments(comment.replies, depth + 1)
      : [],
  }));
}
