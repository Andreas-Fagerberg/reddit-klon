class DataFilterService {
  filterRelevantData(posts, comments, users) {
    const uniqueUserIds = [...new Set(posts.map((post) => post.userId))];
    const postIds = posts.map((post) => post.id);

    // Filter comments that belong to fetched posts
    const matchingComments = comments.filter((comment) =>
      postIds.includes(comment.postId)
    );

    // Get unique user IDs from both posts and comments
    const commentUserIds = [
      ...new Set(matchingComments.map((comment) => comment.userId)),
    ];

    const allRelevantUserIds = [
      ...new Set([...uniqueUserIds, ...commentUserIds]),
    ];

    // Filter users that are either post authors or comment authors
    const matchingUsers = users.filter((user) =>
      allRelevantUserIds.includes(user.id)
    );
    for (let comment of comments) {
      delete comment.user.fullName;
      delete comment.likes;
    }
    
    return { posts, users: matchingUsers, comments: matchingComments };
  }
}

export const dataFilterService = new DataFilterService();
