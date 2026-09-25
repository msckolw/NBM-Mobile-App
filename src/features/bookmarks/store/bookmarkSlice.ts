import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface BookmarkArticle {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

interface BookmarkState {
  items: BookmarkArticle[];
}

const initialState: BookmarkState = {
  items: [],
};

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<BookmarkArticle>) => {
      const index = state.items.findIndex(
        item => item._id === action.payload._id,
      );

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const {toggleBookmark} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;