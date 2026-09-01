import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useDetailedNews } from '../../news/hooks/DetailedNews';
import { useThemeStore } from '../../../store/ThemeStore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useBookmarkStore } from '../../../store/BookmarkStore';
import { logEvent } from '../../../services/monitoring/analytics';
import { timeAgo } from '../../../utils/timeAgo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { log } from '../../../services/monitoring/crashlytics';
import { setAuth } from '../../../features/auth/store/authslice';
import { googleLogin } from '../../../services/auth/googleAuth';
import { googleSignIn } from '../../../api/auth';
import { AppDispatch, RootState } from '../../../store/index';
import AuthRequiredModal from '../../../features/auth/components/AuthRequiredModal';
// TEMPORARILY COMMENTED OUT FOR BUILD - WILL RESTORE LATER
// import { googleLogin } from "../../services/auth/googleAuth";

const ReadMore = (props: any) => {
  const trackedRead = useRef(false);
  const { id } = props?.route?.params || {};
  const { data, loading, error } = useDetailedNews(id);
  const theme = useThemeStore((s: any) => s.theme);
  const navigation = useNavigation();
  const { toggleBookmark, isBookmarked } = useBookmarkStore();
  const dispatch = useDispatch<AppDispatch>();

const { token } = useSelector((state: RootState) => state.auth);

const isAuthenticated = !!token;

const [showAuthModal, setShowAuthModal] = useState(false);

  const article = useMemo(() => {
    if (Array.isArray(data)) {
      return data[0];
    }
    return data;
  }, [data]);
    useEffect(() => {
    if (!article?._id) {
      return;
    }
  
    logEvent('article_viewed', {
      article_id: article._id,
      category: article.category ?? 'unknown',
      origin: 'ReadMore',
    });
  }, [article?._id]);

  // useEffect(() => {
  //   trackedRead.current = false;
  // }, [id]);

  const bookmarked = !!(article && article._id) && isBookmarked(article._id);



  const handleArticleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    const scrollableHeight = contentSize.height - layoutMeasurement.height;

    if (scrollableHeight <= 0) {
      return;
    }

    const scrollPercentage = (contentOffset.y / scrollableHeight) * 100;

    if (  article?._id &&
      scrollPercentage >= 80 &&
      !trackedRead.current) {
      trackedRead.current = true;

      logEvent('article_read', {
        article_id: article?._id,
        category: article?.category ?? 'unknown',
      });
    }
  };

  const handleShare = async () => {
    if (!article) {
      return;
    }
  
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${
          article.summary || ''
        }\n\nRead more: https://www.thenobiasmedia.com/article/${article._id}`,
      });
  
      logEvent('article_shared', {
        article_id: article._id,
        category: article.category ?? 'unknown',
        origin: 'ReadMore',
      });
    } catch (err) {
      console.log('Share failed:', err);
    }
  };


  const handleBookmark = () => {
    console.log("dawda")
    if (!article?._id) {
      return;
    }
  
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
  
    toggleBookmark(article);
  
    logEvent(
      bookmarked ? 'article_unbookmarked' : 'article_bookmarked',
      {
        article_id: article._id,
        category: article.category ?? 'unknown',
        origin: 'ReadMore',
      },
    );
  };


  const handleGoogleLogin = useCallback(async () => {
    log('Google login started');
  
    try {
      const result = await googleLogin();
  
      if (!result?.user?.email) {
        return;
      }
  
      log('Google authentication successful');
  
      const response = await googleSignIn({
        email: result.user.email,
        name: result.user.name ?? '',
      });
  
      console.log('Backend Google login:', response);
  
      if (response?.success) {
        log('Backend authentication successful');
  
        dispatch(
          setAuth({
            token: response.token,
            user: response.user,
          }),
        );
  
        setShowAuthModal(false);
  
        // Save the article after successful authentication
        toggleBookmark(article);
  
        logEvent('article_bookmarked', {
          article_id: article._id,
          category: article.category ?? 'unknown',
          origin: 'ReadMore',
        });
  
        log('User session established');
  
        Alert.alert(
          'Login successful',
          'Your article has been saved to bookmarks.',
        );
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }, [article, dispatch, toggleBookmark]);

  if (!id) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          backgroundColor: theme === 'light' ? '#fff' : '#000',
        }}
      >
        <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>
          Missing article id.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme === 'light' ? '#fff' : '#000',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          backgroundColor: theme === 'light' ? '#fff' : '#000',
        }}
      >
        <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>
          Failed to load article.
        </Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          backgroundColor: theme === 'light' ? '#fff' : '#000',
        }}
      >
        <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>
          Article not found.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme === 'light' ? '#fff' : '#000' }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        onScroll={handleArticleScroll}
        scrollEventThrottle={200}
      >
<View
  style={{
    paddingHorizontal: 16,
    // paddingTop: 8,
    // paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  }}
>
  <TouchableOpacity
    onPress={() => (navigation as any).goBack()}
    style={{ padding: 8, marginRight: 8 }}
    hitSlop={8}
  >
    <Icon
      name="arrow-back"
      size={22}
      color={theme === 'light' ? '#000' : '#fff'}
    />
  </TouchableOpacity>

  <Text
    style={{
      color: theme === 'light' ? '#000' : '#fff',
      fontSize: 17,
      fontWeight: '700',
    }}
  >
    {String(article?.category.toUpperCase() || 'News')}
  </Text>
</View>

        {!!article.imageUrl && (
          <Image
            source={{ uri: article.imageUrl }}
            style={{ width: '100%', height: 240, marginTop: 12 }}
            resizeMode="cover"
          />
        )}

        <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
          <Text style={{ color: '#007AFF', fontSize: 12, fontWeight: '600' }}>
            {String(article?.category || '').toUpperCase()}
          </Text>
          <Text
            style={{
              color: theme === 'light' ? '#000' : '#fff',
              fontSize: 22,
              fontWeight: '700',
              marginTop: 8,
            }}
          >
            {article.title}
          </Text>
          {/* {!!article.createdAt && (
            <Text
              style={{
                color: theme === 'light' ? '#666' : '#aaa',
                fontSize: 12,
                marginTop: 6,
              }}
            >
              {new Date(article.createdAt).toDateString()}
            </Text>
          )} */}


          {!!article.content && (
            <Text
              style={{
                color: theme === 'light' ? '#000' : '#fff',
                fontSize: 16,
                marginTop: 14,
                lineHeight: 24,
              }}
            >
              {article.content}
            </Text>
            
          )}

<View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  }}
>
  {/* DATE — LEFT */}
  <View>
    {!!article.createdAt && (
      <Text
        style={{
          color: theme === 'light' ? '#666' : '#aaa',
          fontSize: 12,
        }}
      >
        {timeAgo(article.createdAt)}
      </Text>
    )}
  </View>

  {/* ACTIONS — RIGHT */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    }}
  >
    {/* SHARE */}
    <TouchableOpacity
      onPress={handleShare}
      hitSlop={8}
    >
      <Icon
        name="share-social-outline"
        size={23}
        color={theme === 'light' ? '#555' : '#ccc'}
      />
    </TouchableOpacity>

    {/* BOOKMARK */}
    <TouchableOpacity
      onPress={handleBookmark}
      hitSlop={8}
    >
      <Icon
        name={bookmarked ? 'bookmark' : 'bookmark-outline'}
        size={24}
        color={theme === 'light' ? '#555' : '#ccc'}
      />
    </TouchableOpacity>
  </View>
</View>

<TouchableOpacity
  onPress={() =>
    (navigation as any).navigate('Sources', { id: article._id })
  }
  style={{
    backgroundColor: '#1D3C75',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 12,
  }}
>
  <Text
    style={{
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    }}
  >
    News Sources
  </Text>
</TouchableOpacity>
        </View>
      </ScrollView>
      <AuthRequiredModal
  visible={showAuthModal}
  onClose={() => setShowAuthModal(false)}
  onGoogleLogin={handleGoogleLogin}
/>
    </SafeAreaView>
  );
};

export default ReadMore;
