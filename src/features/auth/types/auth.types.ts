export type User = {
  id: string;
  name: string;
  email: string;
};


export type PendingAuthAction =
  | {
      type: 'BOOKMARK';
      article: {
        _id: string;
        title: string;
        summary: string;
        imageUrl: string;
        category: string;
        createdAt: string;
      };
    }
  | null;