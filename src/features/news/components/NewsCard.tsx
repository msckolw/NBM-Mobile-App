import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';

import { useCallback, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';

import { useBookmarkStore } from '../../../store/BookmarkStore';
import { timeAgo } from '../../../utils/timeAgo';
import type { RootState, AppDispatch } from '../../../store';
import { setAuth } from '../../auth/store/authslice';
import { googleSignIn } from '../../../api/auth';
import { googleLogin } from '../../../services/auth/googleAuth';
import AuthRequiredModal from '../../../features/auth/components/AuthRequiredModal';

type ArticleLike = {
  _id: string;
  title?: string;
  summary?: string;
  imageUrl?: string;
  category?: string;
  createdAt?: string;
};

type BookmarkArticle = {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  createdAt: string;
};

type NewsCardProps = {
  article: any;
  theme?: any;
  onPress?: () => void;
  title?: string;
  secondaryTitle?: string;
  onSecondaryPress?: () => void;
  origin?: string;
};

export default function NewsCard({
  article,
  theme = 'light',
  onPress,
  title,
  secondaryTitle,
  onSecondaryPress,
  origin,
}: NewsCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toggleBookmark, isBookmarked } = useBookmarkStore();
  const { user, token } = useSelector((state: RootState) => state.auth);
  // const { user, token, setAuth } = useAuthStore();
  const [pendingBookmark, setPendingBookmark] =
  useState<BookmarkArticle | null>(null);

const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);


  const isAuthenticated = !!token;
  const isReadMore = origin === 'ReadMore';
  const useThisArticle: ArticleLike | undefined = isReadMore
    ? article
    : article?.item ?? article;
  const bookmarked = !!useThisArticle?._id && isBookmarked(useThisArticle._id);



  const bookmarkArticle: BookmarkArticle | null = useThisArticle?._id
    ? {
        _id: useThisArticle._id,
        title: useThisArticle.title ?? '',
        summary: useThisArticle.summary ?? '',
        imageUrl: useThisArticle.imageUrl ?? '',
        category: useThisArticle.category ?? '',
        createdAt: useThisArticle.createdAt ?? new Date().toISOString(),
      }
    : null;

  if (!useThisArticle?._id) {
    return null;
  }
  console.log('Bookmark pressed:', useThisArticle?._id);
  const handleShare = async () => {
    try {
      await Share.share({
        title: useThisArticle.title ?? '',
        message: `${useThisArticle.title ?? ''}\n\n${
          useThisArticle.summary ?? ''
        }\n\nRead more: https://www.thenobiasmedia.com/article/${
          useThisArticle._id
        }`,
      });
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const handleBookmark = () => {
    if (!bookmarkArticle) {
      return;
    }

    if (!isAuthenticated) {
      setPendingBookmark(bookmarkArticle);
      setShowAuthModal(true);
      return;
    }

    toggleBookmark(bookmarkArticle);
  };

  const handleGoogleLogin = useCallback(async () => {
    try {
      const result = await googleLogin();
  
      if (!result?.user?.email) {
        return;
      }
  
      const response = await googleSignIn({
        email: result.user.email,
        name: result.user.name ?? '',
      });
  
      console.log('Backend Google login:', response);
  
      if (response?.success) {
        dispatch(
          setAuth({
            token: response.token,
            user: response.user,
          }),
        );
  
        setShowAuthModal(false);
  
        if (pendingBookmark) {
          toggleBookmark(pendingBookmark);
          setPendingBookmark(null);
  
          setTimeout(() => {
            Alert.alert(
              'Login successful',
              'Your article has been saved to bookmarks.',
            );
          }, 300);
        }
  
        console.log('Authentication successful');
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }, [dispatch, pendingBookmark, toggleBookmark]);
  

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme == 'dark' ? 'black' : 'white' },
      ]}
    >
      {/* origin = "ReadMore" */}
      <Image source={{ uri: useThisArticle.imageUrl }} style={styles.image} />

      <Text style={styles.category}>
        {useThisArticle?.category?.toUpperCase()}
      </Text>

      <Text style={styles.title}>{useThisArticle?.title}</Text>

      <Text style={styles.summary}>{useThisArticle?.summary}</Text>

      {/* ACTION BUTTONS */}
      <View style={styles.actions}>
        <View>
          {!!useThisArticle?.createdAt && (
            <Text style={styles.date}>
              {new Date(useThisArticle.createdAt).toDateString()}
            </Text>
          )}
          {!!useThisArticle?.createdAt && (
            <Text style={styles.date}>{timeAgo(useThisArticle.createdAt)}</Text>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare}>
            <Icon name="share-social-outline" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBookmark}
            // onPress={ googleLogin}
          >
            <Icon
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              // name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={26}
              color={'#555'}
              // color={isBookmarked ? "#007AFF" : "#555"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ctaWrap}>
        {!!title && !!onPress && (
          <TouchableOpacity style={styles.ctaPrimary} onPress={onPress}>
            <Text style={styles.ctaText}>{title}</Text>
          </TouchableOpacity>
        )}
        {!!secondaryTitle && !!onSecondaryPress && (
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={onSecondaryPress}
          >
            <Text style={styles.ctaText}>{secondaryTitle}</Text>
          </TouchableOpacity>
        )}
      </View>

      <AuthRequiredModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onGoogleLogin={handleGoogleLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },
  image: {
    height: 220,
    width: '100%',
    borderRadius: 14,
    marginBottom: 12,
  },
  category: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#000',
  },
  summary: {
    fontSize: 15,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 18,
  },
  date: {
    // marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
  ctaWrap: {
    // marginTop: 14,
    // gap: 12,
  },
  ctaPrimary: {
    backgroundColor: '#1D3C75',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    // padding:5,
    marginBottom: 4,
  },
  ctaSecondary: {
    backgroundColor: '#1D3C75',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
