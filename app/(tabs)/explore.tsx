import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { triggerHapticFeedback } from '@/lib/utils/common';

const CATEGORIES = [
  { id: 'featured', name: 'Featured', icon: 'star' },
  { id: 'trending', name: 'Trending', icon: 'trending-up' },
  { id: 'new', name: 'New', icon: 'flash' },
  { id: 'popular', name: 'Popular', icon: 'heart' },
];

const SAMPLE_ITEMS = [
  {
    id: 1,
    title: 'Amazing Feature',
    description: 'Discover this incredible new capability that will change how you work.',
    category: 'featured',
    image: '🚀',
  },
  {
    id: 2,
    title: 'Productivity Boost',
    description: 'Learn techniques to supercharge your productivity and efficiency.',
    category: 'trending',
    image: '⚡',
  },
  {
    id: 3,
    title: 'Creative Tools',
    description: 'Explore new creative tools that unlock your artistic potential.',
    category: 'new',
    image: '🎨',
  },
  {
    id: 4,
    title: 'Community Hub',
    description: 'Connect with like-minded individuals and share your experiences.',
    category: 'popular',
    image: '🤝',
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('featured');

  const handleCategoryPress = (categoryId: string) => {
    triggerHapticFeedback('light');
    setSelectedCategory(categoryId);
  };

  const handleItemPress = (item: any) => {
    triggerHapticFeedback('light');
    // Navigate to item detail
  };

  const filteredItems = SAMPLE_ITEMS.filter(item => 
    item.category === selectedCategory &&
    (searchQuery === '' || 
     item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for anything..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8E8E93"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.categoryItemActive
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={20} 
                  color={selectedCategory === category.id ? '#FFFFFF' : '#007AFF'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Grid */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>
            {CATEGORIES.find(c => c.id === selectedCategory)?.name} Items
          </Text>
          <View style={styles.itemsGrid}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => handleItemPress(item)}
              >
                <Text style={styles.itemEmoji}>{item.image}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.itemFooter}>
                  <Ionicons name="arrow-forward" size={16} color="#007AFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your search or selecting a different category
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoriesScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  categoryItemActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  itemsGrid: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  itemFooter: {
    alignItems: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});