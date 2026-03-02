import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import WText from '../Common/WText';
import { Member } from '../../types';
import { MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_MEMBERS: Member[] = [];

interface Props {
  onBack: () => void;
}

const MemberListScreen: React.FC<Props> = ({ onBack }) => {
  const [filter, setFilter] = useState('');

  const filtered = MOCK_MEMBERS.filter(m =>
    m.fullName.toLowerCase().includes(filter.toLowerCase()) ||
    m.dharmaName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <MaterialIcon name="arrow-back" size={24} color="#008A45" />
            </TouchableOpacity>
            <WText type="medium24" style={styles.headerTitle}>Thành viên</WText>
          </View>

          <View style={styles.searchContainer}>
            <MaterialIcon name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo tên hoặc pháp danh..."
              placeholderTextColor="#9CA3AF"
              value={filter}
              onChangeText={setFilter}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.listContainer}>
          {filtered.map(member => (
            <TouchableOpacity key={member.id} style={styles.card} activeOpacity={0.7}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: member.avatar }} style={styles.avatar} />
                <View style={[styles.statusDot, member.status === 'active' ? styles.statusActive : styles.statusInactive]} />
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.nameRow}>
                  <WText type="medium16" style={styles.fullName}>{member.fullName}</WText>
                  <View style={styles.rankBadge}>
                    <WText type="medium9" style={styles.rankText}>{member.rank}</WText>
                  </View>
                </View>

                <WText type="medium12" style={styles.dharmaName}>{member.dharmaName}</WText>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MaterialIcon name="work-outline" size={12} color="#9CA3AF" />
                    <WText type="medium10" style={styles.metaText}>{member.position}</WText>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcon name="category" size={12} color="#9CA3AF" />
                    <WText type="medium10" style={styles.metaText}>{member.department}</WText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcon name="person-search" size={64} color="#D1D5DB" />
              <WText type="medium14" style={styles.emptyStateText}>Không có thành viên nào</WText>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  headerTitle: {
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#1F2937',
    height: '100%',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  statusDot: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusActive: {
    backgroundColor: '#22C55E',
  },
  statusInactive: {
    backgroundColor: '#9CA3AF',
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fullName: {
    flex: 1,
    color: '#1F2937',
    marginRight: 8,
  },
  rankBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rankText: {
    color: '#008A45',
    textTransform: 'uppercase',
  },
  dharmaName: {
    color: '#008A45',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    opacity: 0.5,
  },
  emptyStateText: {
    marginTop: 16,
    color: '#9CA3AF',
  }
});

export default MemberListScreen;
