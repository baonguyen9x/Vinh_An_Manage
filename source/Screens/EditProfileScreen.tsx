import React, { useState, useRef } from 'react';
import {
  View, TextInput, TouchableOpacity, Image,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  ActivityIndicator, Platform, Modal, FlatList, Animated, Dimensions, StatusBar,
} from 'react-native';
import WText from '../Common/WText';

import { Member } from '../../types';
import { MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from '../Common/Constants';
import { MemberService } from '../services/firebase';
import Languages from '../Common/Languages';
import {
  GENDERS, CATEGORIES, DEPARTMENTS, ORDINATION_LEVELS,
  MemberCategory, RANKS_MAP, getRolesByCategory, getRankKey,
} from '../Common/MemberEnums';
import Style from '../Common/Style';

interface Props {
  user: Member;
  onBack: () => void;
  onUpdate: (user: Member) => void;
}

const EditProfileScreen: React.FC<Props> = ({ user, onBack, onUpdate }) => {
  const [formData, setFormData] = useState<Member>({
    ...user,
    isOrdained: user.isOrdained ?? false,
    ordinationDate: user.ordinationDate ?? '',
    ordinationLevel: user.ordinationLevel ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Logic tính cấp bậc tự động ──────────────────────────────
  const calculatePromotionRank = (data: Member): string => {
    if (data.position === MemberCategory.DOAN_SINH) return MemberCategory.DOAN_SINH;
    if (data.position === MemberCategory.HUYNH_TRUONG) {
      if (data.isOrdained) {
        return data.ordinationLevel
          ? `${MemberCategory.HUYNH_TRUONG} ${data.ordinationLevel}`
          : Languages.get('screen.edit_profile.promotion_ordained');
      }
      if (data.rank === 'Kiên') return Languages.get('screen.edit_profile.promotion_loc_uyen');
      if (data.rank === 'Trì') return Languages.get('screen.edit_profile.promotion_a_duc');
      return Languages.get('common.undefined');
    }
    return '';
  };

  const validateRank = (isOrdained: boolean, rank: string): boolean => {
    if (!isOrdained && (rank === 'Định' || rank === 'Lực')) {
      setError(Languages.get('screen.edit_profile.error_rank_requires_ordination'));
      return false;
    }
    setError(null);
    return true;
  };

  const handleChange = (field: keyof Member, value: any) => {
    let newData = { ...formData, [field]: value };

    if (field === 'position') {
      const key = getRankKey(value, newData.department);
      const ranks = RANKS_MAP[key] || [];
      newData.rank = ranks[0] || '';
      newData.role = getRolesByCategory(value)[0] || '';
      if (value !== MemberCategory.HUYNH_TRUONG) {
        newData.isOrdained = false;
        setError(null);
      }
    }

    if (field === 'department' && newData.position === MemberCategory.DOAN_SINH) {
      const ranks = RANKS_MAP[`${MemberCategory.DOAN_SINH}_${value}`] || [];
      newData.rank = ranks[0] || '';
    }

    if (newData.position === MemberCategory.HUYNH_TRUONG) {
      validateRank(newData.isOrdained || false, newData.rank);
    }

    newData.promotionRank = calculatePromotionRank(newData);
    setFormData(newData);
  };

  const handleSave = async () => {
    if (
      formData.position === MemberCategory.HUYNH_TRUONG &&
      !formData.isOrdained &&
      (formData.rank === 'Định' || formData.rank === 'Lực')
    ) {
      setError(Languages.get('screen.edit_profile.error_save_invalid'));
      return;
    }
    if (!formData.uid) {
      setError(Languages.get('screen.edit_profile.error_no_user'));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { id, uid, ...updateData } = formData as any;
      await MemberService.update(formData.uid, updateData);
      onUpdate(formData);
    } catch (e: any) {
      console.error('[EditProfile] update error:', e);
      setError(Languages.get('screen.edit_profile.error_save_failed') + ': ' + (e.message || Languages.get('screen.edit_profile.error_unknown')));
    } finally {
      setSaving(false);
    }
  };

  const availableRanks = RANKS_MAP[getRankKey(formData.position, formData.department)] || [];
  const availableRoles = getRolesByCategory(formData.position);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" translucent={false} />
      <KeyboardAvoidingView
        behavior={Constants.IS_IOS ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcon name="arrow-back" size={24} color="#008A45" />
          </TouchableOpacity>
          <WText type="medium16" style={styles.headerTitle}>
            {Languages.get('screen.edit_profile.title')}
          </WText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={formData.avatar ? { uri: formData.avatar } : require('../Images/ic_user_default.png')}
                style={styles.avatarImage}
              />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <MaterialIcon name="photo-camera" size={16} color="#008A45" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Thông tin cơ bản */}
            <SectionTitle title={Languages.get('screen.edit_profile.section_basic_info')} />
            <EditField
              icon="person"
              label={Languages.get('screen.edit_profile.label_fullname')}
              value={formData.fullName}
              onChange={(v) => handleChange('fullName', v)}
            />
            <EditField
              icon="spa"
              label={Languages.get('screen.edit_profile.label_dharma_name')}
              value={formData.dharmaName}
              onChange={(v) => handleChange('dharmaName', v)}
            />
            <SelectField
              icon="wc"
              label={Languages.get('screen.edit_profile.label_gender')}
              value={formData.gender}
              options={GENDERS}
              onChange={(v) => handleChange('gender', v)}
            />
            <EditField
              icon="email"
              label={Languages.get('screen.edit_profile.label_email')}
              value={formData.email}
              onChange={(v) => handleChange('email', v)}
              keyboardType="email-address"
            />
            <EditField
              icon="phone"
              label={Languages.get('screen.edit_profile.label_phone')}
              value={formData.phone}
              onChange={(v) => handleChange('phone', v)}
              keyboardType="phone-pad"
            />
            <DateField
              icon="calendar-today"
              label={Languages.get('screen.edit_profile.label_join_date')}
              value={formData.joinDate}
              onChange={(v) => handleChange('joinDate', v)}
            />

            {/* Thông tin tổ chức */}
            <SectionTitle title={Languages.get('screen.edit_profile.section_org_info')} />
            <SelectField
              icon="category"
              label={Languages.get('screen.edit_profile.label_category')}
              value={formData.position}
              options={CATEGORIES}
              onChange={(v) => handleChange('position', v)}
            />
            <SelectField
              icon="account-tree"
              label={Languages.get('screen.edit_profile.label_department')}
              value={formData.department}
              options={DEPARTMENTS}
              onChange={(v) => handleChange('department', v)}
            />
            <SelectField
              icon="school"
              label={Languages.get('screen.edit_profile.label_rank')}
              value={formData.rank}
              options={availableRanks}
              onChange={(v) => handleChange('rank', v)}
            />
            <SelectField
              icon="badge"
              label={Languages.get('screen.edit_profile.label_role')}
              value={formData.role || ''}
              options={availableRoles}
              onChange={(v) => handleChange('role', v)}
            />

            {/* Tình trạng thọ cấp (chỉ Huynh trưởng) */}
            {formData.position === MemberCategory.HUYNH_TRUONG && (
              <View style={styles.ordainedCard}>
                <WText type="medium10" style={styles.ordainedCardTitle}>
                  {Languages.get('screen.edit_profile.label_ordination_status')}
                </WText>
                <View style={styles.ordainedRow}>
                  <OrdinationOption
                    label={Languages.get('screen.edit_profile.ordination_yes')}
                    active={!!formData.isOrdained}
                    onPress={() => handleChange('isOrdained', true)}
                  />
                  <OrdinationOption
                    label={Languages.get('screen.edit_profile.ordination_no')}
                    active={!formData.isOrdained}
                    onPress={() => handleChange('isOrdained', false)}
                  />
                </View>
                {formData.isOrdained && (
                  <View style={styles.ordainedDetails}>
                    <DateField
                      icon="event"
                      label={Languages.get('screen.edit_profile.label_ordination_date')}
                      value={formData.ordinationDate || ''}
                      onChange={(v) => handleChange('ordinationDate', v)}
                    />
                    <SelectField
                      icon="military-tech"
                      label={Languages.get('screen.edit_profile.label_ordination_level')}
                      value={formData.ordinationLevel || ''}
                      options={ORDINATION_LEVELS}
                      onChange={(v) => handleChange('ordinationLevel', v)}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Error */}
            {!!error && (
              <View style={styles.errorBox}>
                <MaterialIcon name="error-outline" size={18} color="#EF4444" />
                <WText type="medium11" style={styles.errorText}>{error}</WText>
              </View>
            )}

            {/* Cấp bậc tự động */}
            <View style={styles.promotionCard}>
              <MaterialIcon name="stars" size={18} color="#008A45" />
              <View style={styles.promotionTextContainer}>
                <WText type="medium10" style={styles.promotionLabel}>
                  {Languages.get('screen.edit_profile.label_promotion_rank')}
                </WText>
                <WText type="medium14" style={styles.promotionValue}>
                  {formData.promotionRank || Languages.get('common.undefined')}
                </WText>
              </View>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, saving && { opacity: 0.7 }]}
            activeOpacity={0.8}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="#FFFFFF" />
              : <WText type="medium14" style={styles.saveButtonText}>{Languages.get('screen.edit_profile.btn_save')}</WText>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ── Sub-components ────────────────────────────────────────────

const SectionTitle = ({ title }: { title: string }) => (
  <View style={styles.sectionTitleRow}>
    <View style={styles.sectionTitleBar} />
    <WText type="medium11" style={styles.sectionTitleText}>{title}</WText>
  </View>
);

interface EditFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: string;
  keyboardType?: any;
}
const EditField: React.FC<EditFieldProps> = ({ label, value, onChange, icon, keyboardType }) => (
  <View style={styles.fieldCard}>
    <View style={styles.fieldIconBox}>
      <MaterialIcon name={icon || 'edit'} size={16} color="#008A45" />
    </View>
    <View style={styles.fieldContent}>
      <WText type="medium10" style={styles.fieldLabel}>{label}</WText>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholderTextColor="#9CA3AF"
        placeholder={'...'}
      />
    </View>
  </View>
);

// ── Pure JS DateField ───────────────────────────────────────────

const ITEM_H = 44;

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const CUR_YEAR = new Date().getFullYear();
const years = Array.from({ length: 80 }, (_, i) => String(CUR_YEAR - i));

interface WheelColumnProps {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  label: string;
}
const WheelColumn: React.FC<WheelColumnProps> = ({ items, selected, onSelect, label }) => {
  const idx = Math.max(0, items.indexOf(selected));
  const ref = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.scrollTo({ y: idx * ITEM_H, animated: false });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <View style={dateStyles.column}>
      <WText type="medium10" style={dateStyles.columnLabel}>{label}</WText>
      <View style={dateStyles.columnMask}>
        {/* highlight row */}
        <View style={dateStyles.highlightBar} />
        <ScrollView
          ref={ref}
          style={dateStyles.columnScroll}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_H}
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: ITEM_H }}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
            const clamped = Math.max(0, Math.min(i, items.length - 1));
            onSelect(items[clamped]);
          }}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item}
              style={dateStyles.columnItem}
              onPress={() => {
                const i = items.indexOf(item);
                ref.current?.scrollTo({ y: i * ITEM_H, animated: true });
                onSelect(item);
              }}
            >
              <WText
                type={item === selected ? 'medium16' : 'regular14'}
                style={[dateStyles.columnItemText, item === selected && dateStyles.columnItemTextSelected]}
              >
                {item}
              </WText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

interface DatePickerModalProps {
  value: string;
  onDone: (v: string) => void;
  onClose: () => void;
}
const DatePickerModal: React.FC<DatePickerModalProps> = ({ value, onDone, onClose }) => {
  const parts = value ? value.split('/') : [];
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = String(now.getFullYear());

  const [selDay, setSelDay] = useState(parts[0] ? parts[0].padStart(2, '0') : d);
  const [selMonth, setSelMonth] = useState(parts[1] ? parts[1].padStart(2, '0') : m);
  const [selYear, setSelYear] = useState(parts[2] || y);

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <TouchableOpacity style={dateStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={dateStyles.pickerContainer}>
        <View style={dateStyles.sheetHandle} />
        <View style={dateStyles.pickerHeader}>
          <TouchableOpacity onPress={onClose} style={dateStyles.cancelBtn}>
            <WText type="medium14" style={dateStyles.cancelText}>{Languages.get('screen.edit_profile.date_picker_cancel')}</WText>
          </TouchableOpacity>
          <WText type="medium14" style={dateStyles.pickerTitle}>{Languages.get('screen.edit_profile.date_picker_title')}</WText>
          <TouchableOpacity
            onPress={() => onDone(`${selDay}/${selMonth}/${selYear}`)}
            style={dateStyles.doneBtn}
          >
            <WText type="medium14" style={dateStyles.doneText}>{Languages.get('screen.edit_profile.date_picker_done')}</WText>
          </TouchableOpacity>
        </View>
        <View style={dateStyles.wheelsRow}>
          <WheelColumn items={days} selected={selDay} onSelect={setSelDay} label={Languages.get('screen.edit_profile.date_picker_day')} />
          <View style={dateStyles.wheelDivider} />
          <WheelColumn items={months} selected={selMonth} onSelect={setSelMonth} label={Languages.get('screen.edit_profile.date_picker_month')} />
          <View style={dateStyles.wheelDivider} />
          <WheelColumn items={years} selected={selYear} onSelect={setSelYear} label={Languages.get('screen.edit_profile.date_picker_year')} />
        </View>
      </View>
    </Modal>
  );
};

interface DateFieldProps {
  label: string;
  value: string;   // dd/MM/yyyy
  onChange: (v: string) => void;
  icon?: string;
}
const DateField: React.FC<DateFieldProps> = ({ label, value, onChange, icon }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <TouchableOpacity style={styles.selectCard} onPress={() => setShow(true)} activeOpacity={0.75}>
        <View style={styles.fieldIconBox}>
          <MaterialIcon name={icon || 'calendar-today'} size={16} color="#008A45" />
        </View>
        <View style={styles.fieldContent}>
          <WText type="medium10" style={styles.fieldLabel}>{label}</WText>
          <WText type="medium14" style={[styles.textInput, !value && styles.datePlaceholder]}>
            {value || Languages.get('screen.edit_profile.date_placeholder')}
          </WText>
        </View>
        <MaterialIcon name="event" size={18} color="#9CA3AF" />
      </TouchableOpacity>
      {show && (
        <DatePickerModal
          value={value}
          onDone={(v) => { onChange(v); setShow(false); }}
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: string;
}
const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange, icon }) => {
  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const openSheet = () => {
    setOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  const handleSelect = (opt: string) => {
    onChange(opt);
    closeSheet();
  };

  return (
    <>
      {/* Trigger row */}
      <TouchableOpacity style={styles.selectCard} onPress={openSheet} activeOpacity={0.75}>
        <View style={styles.fieldIconBox}>
          <MaterialIcon name={icon || 'list'} size={16} color="#008A45" />
        </View>
        <View style={styles.fieldContent}>
          <WText type="medium10" style={styles.fieldLabel}>{label}</WText>
          <WText
            type="medium14"
            style={[styles.selectValue, !value && styles.selectPlaceholder]}
            numberOfLines={1}
          >
            {value || Languages.get('screen.edit_profile.picker_placeholder')}
          </WText>
        </View>
        <MaterialIcon name="keyboard-arrow-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal visible={open} transparent animationType="none" onRequestClose={closeSheet}>
        {/* Backdrop */}
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeSheet} />

        {/* Sheet */}
        <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle bar */}
          <View style={styles.sheetHandle} />

          {/* Title */}
          <View style={styles.sheetHeader}>
            <WText type="medium14" style={styles.sheetTitle}>{label}</WText>
            <TouchableOpacity onPress={closeSheet} style={styles.sheetCloseBtn}>
              <MaterialIcon name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Options list */}
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetList}
            renderItem={({ item }) => {
              const selected = item === value;
              return (
                <TouchableOpacity
                  style={[styles.optionRow, selected && styles.optionRowSelected]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <WText
                    type={selected ? 'medium14' : 'regular14'}
                    style={[styles.optionText, selected && styles.optionTextSelected]}
                  >
                    {item}
                  </WText>
                  {selected && <MaterialIcon name="check-circle" size={20} color="#008A45" />}
                </TouchableOpacity>
              );
            }}
          />
        </Animated.View>
      </Modal>
    </>
  );
};

const OrdinationOption = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.ordainedOption} activeOpacity={0.7}>
    <View style={[styles.checkbox, active && styles.checkboxActive]}>
      {active && <MaterialIcon name="check" size={12} color="#FFF" />}
    </View>
    <WText type="medium13" style={[styles.ordainedText, active && styles.ordainedTextActive]}>{label}</WText>
  </TouchableOpacity>
);

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: { padding: 8 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#008A45',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  scrollContent: { padding: 16, paddingBottom: 48, backgroundColor: '#F7F9F7' },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    alignSelf: 'center',
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#008A45',
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  avatarImage: { width: '90%', height: '90%', alignSelf: 'center', justifyContent: 'center' },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: '#FFFFFF',
    padding: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#008A45',
  },

  formContainer: { gap: 0 },

  // Section title
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  sectionTitleBar: {
    width: 3,
    height: 14,
    backgroundColor: '#008A45',
    borderRadius: 2,
  },
  sectionTitleText: {
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // Field card (shared by EditField & SelectField)
  fieldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 16 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  fieldIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldContent: { flex: 1 },
  fieldLabel: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    marginBottom: 0,
  },
  textInput: {
    ...Style.textFontSize12,
    ...Style.textWeight400,
    ...Style.fontRegular,
    color: '#0f1011ff',
    padding: 0,
    paddingVertical: Platform.OS === 'ios' ? 2 : 0,
  },

  // Select row
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectValue: {
    flex: 1,
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  selectPlaceholder: {
    color: '#9CA3AF',
  },
  datePlaceholder: {
    color: '#C4C9D4',
    fontSize: 12,
  },

  // Bottom sheet modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetTitle: {
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  sheetCloseBtn: {
    padding: 4,
  },
  sheetList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 2,
  },
  optionRowSelected: {
    backgroundColor: '#F0FDF4',
  },
  optionText: {
    color: '#374151',
    fontSize: 15,
  },
  optionTextSelected: {
    color: '#008A45',
  },

  // Ordination card
  ordainedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,138,69,0.1)',
  },
  ordainedCardTitle: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  ordainedRow: { flexDirection: 'row', gap: 24, marginBottom: 4 },
  ordainedOption: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: { backgroundColor: '#008A45', borderColor: '#008A45' },
  ordainedText: { color: '#6B7280' },
  ordainedTextActive: { color: '#008A45', fontWeight: '600' },
  ordainedDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 0,
  },

  // Promotion card
  promotionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,138,69,0.15)',
    gap: 12,
  },
  promotionTextContainer: { flex: 1 },
  promotionLabel: {
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  promotionValue: { color: '#008A45', fontWeight: '600' },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 10,
    gap: 8,
  },
  errorText: { color: '#DC2626', flex: 1 },

  // Save button
  saveButton: {
    backgroundColor: '#008A45',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#008A45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { color: '#FFFFFF', letterSpacing: 2 },
});

const dateStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  pickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetHandle: {
    width: 40, height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12, marginBottom: 4,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerTitle: { color: '#1F2937' },
  cancelBtn: { padding: 4 },
  cancelText: { color: '#9CA3AF' },
  doneBtn: { padding: 4 },
  doneText: { color: '#008A45' },
  // 3-column wheels
  wheelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  wheelDivider: { width: 1, height: 120, backgroundColor: '#F3F4F6', marginHorizontal: 4 },
  column: { flex: 1, alignItems: 'center' },
  columnLabel: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  columnMask: {
    height: ITEM_H * 3,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  highlightBar: {
    position: 'absolute',
    top: ITEM_H,
    left: 4, right: 4,
    height: ITEM_H,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    zIndex: 0,
  },
  columnScroll: { width: '100%' },
  columnItem: {
    height: ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnItemText: { color: '#9CA3AF' },
  columnItemTextSelected: { color: '#008A45' },
});

export default EditProfileScreen;
