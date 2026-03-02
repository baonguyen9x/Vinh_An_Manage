import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcon } from '../Common/Utils';

interface Props {
  onBack: () => void;
  onAdd?: () => void;
}

// Helper component for empty states in the tree
const EmptyState = () => (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyStateText}>Chưa có thành viên</Text>
  </View>
);

// Helper component for subheaders in sections
const SubHeader = ({ title }: { title: string }) => (
  <View style={styles.subHeaderContainer}>
    <View style={styles.subHeaderDot} />
    <Text style={styles.subHeaderText}>{title}</Text>
  </View>
);

interface GroupContainerProps {
  title: string;
  children: React.ReactNode;
  color?: string;
}

// Helper component for grouping members within a section
const GroupContainer: React.FC<GroupContainerProps> = ({ title, children, color = "#008A45" }) => (
  <View style={styles.groupContainer}>
    <View style={[styles.groupTitleContainer, { backgroundColor: color }]}>
      <Text style={styles.groupTitleText}>{title}</Text>
    </View>
    <View style={styles.groupContentContainer}>
      {children}
    </View>
  </View>
);

interface TreeSectionProps {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
}

// Helper component for main sections of the family tree
const TreeSection: React.FC<TreeSectionProps> = ({ title, children, onAdd }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <TouchableOpacity
        onPress={onAdd}
        style={styles.addButton}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>Thêm</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.sectionContentContainer}>
      {children}
    </View>
  </View>
);

const FamilyTreeScreen: React.FC<Props> = ({ onBack, onAdd }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcon name="arrow-back-ios" size={20} color="#008A45" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Hệ thống gia phả</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          <TreeSection title="Gia trưởng" onAdd={onAdd}>
            <EmptyState />
          </TreeSection>

          <TreeSection title="Ban thường vụ" onAdd={onAdd}>
            <SubHeader title="Liên đoàn trưởng" />
            <EmptyState />

            <SubHeader title="Liên đoàn phó" />
            <EmptyState />

            <SubHeader title="Thư ký" />
            <EmptyState />

            <SubHeader title="Thủ quỹ" />
            <EmptyState />
          </TreeSection>

          <TreeSection title="Ngành Thanh" onAdd={onAdd}>
            <GroupContainer title="Đoàn Thanh Nam (Nam)">
              <SubHeader title="Huynh Trưởng" />
              <EmptyState />
              <SubHeader title="Đoàn sinh" />
              <EmptyState />
            </GroupContainer>

            <GroupContainer title="Đoàn Thanh Nữ (Nữ)" color="#EC4899">
              <SubHeader title="Huynh Trưởng" />
              <EmptyState />
              <SubHeader title="Đoàn sinh" />
              <EmptyState />
            </GroupContainer>
          </TreeSection>

          <TreeSection title="Ngành Thiếu" onAdd={onAdd}>
            <GroupContainer title="Đoàn Thiếu Nam (Nam)">
              <SubHeader title="Huynh Trưởng" />
              <EmptyState />
              <SubHeader title="Đoàn sinh" />
              <EmptyState />
            </GroupContainer>

            <GroupContainer title="Đoàn Thiếu Nữ (Nữ)" color="#EC4899">
              <SubHeader title="Huynh Trưởng" />
              <EmptyState />
              <SubHeader title="Đoàn sinh" />
              <EmptyState />
            </GroupContainer>
          </TreeSection>

          <TreeSection title="Ngành Oanh" onAdd={onAdd}>
            <GroupContainer title="Đoàn Oanh Nam (Nam)">
              <SubHeader title="Huynh Trưởng" />
              <EmptyState />
              <SubHeader title="Đoàn sinh" />
              <EmptyState />
            </GroupContainer>

            <GroupContainer title="Đoàn Oanh Nữ (Nữ)" color="#EC4899">
              <SubHeader title="Huynh Trưởng" />
              <EmptyState />
              <SubHeader title="Đoàn sinh" />
              <EmptyState />
            </GroupContainer>
          </TreeSection>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 30,
  },
  backButton: {
    padding: 8,
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#008A45',
    fontWeight: 'bold',
    fontSize: 18,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  emptyStateContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 10,
    color: '#D1D5DB',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
  subHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  subHeaderDot: {
    width: 4,
    height: 12,
    backgroundColor: 'rgba(0, 138, 69, 0.3)',
    borderRadius: 4,
    marginRight: 8,
  },
  subHeaderText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitleContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  groupTitleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  groupContentContainer: {
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#F3F4F6',
    borderStyle: 'dashed',
    marginLeft: 4,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 12,
  },
  sectionHeaderContainer: {
    backgroundColor: '#008A45',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeaderText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContentContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderTopWidth: 0,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  }
});

export default FamilyTreeScreen;
