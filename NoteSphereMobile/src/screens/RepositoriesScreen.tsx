import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { api } from '../services/api';
import { Repository } from '../types/repository';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { RepositoryCard } from '../components/RepositoryCard';
import { COLORS, FONTS, SIZES } from '../utils/theme';

export const RepositoriesScreen = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchRepositories = async (pageNumber = 0, shouldRefresh = false) => {
    try {
      if (shouldRefresh) {
        setLoading(true);
      }
      const response = await api.get('/api/repositories/all', {
        params: {
          page: pageNumber,
          size: 10,
          sort: 'createdAt,desc'
        }
      });

      const newRepositories = response.data.content;
      setHasMore(!response.data.last);
      
      if (shouldRefresh) {
        setRepositories(newRepositories);
      } else {
        setRepositories(prev => [...prev, ...newRepositories]);
      }
      setError(null);
    } catch (err) {
      setError('An error occurred while loading repositories');
      console.error('Repository fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRepositories(0, true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    fetchRepositories(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRepositories(nextPage);
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <View style={styles.container}>
      {repositories && repositories.length > 0 ? (
        <FlatList
          data={repositories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RepositoryCard repository={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
            />
          }
          ListFooterComponent={
            loading && !refreshing ? (
              <View style={styles.footerLoader}>
                <LoadingSpinner />
              </View>
            ) : null
          }
        />
      ) : (
        <Text style={styles.noDataText}>Henüz repository bulunmuyor</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.md,
    backgroundColor: COLORS.background,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: SIZES.xl,
    fontSize: 16,
    color: COLORS.textLight,
    ...FONTS.regular,
  },
  footerLoader: {
    paddingVertical: SIZES.md,
  },
}); 