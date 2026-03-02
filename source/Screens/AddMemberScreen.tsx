import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import WText from '../Common/WText';
import { Picker } from '@react-native-picker/picker';
import { Member } from '../../types';
import { MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from '../Common/Constants';
import Style from '../Common/Style';
import Languages from '../Common/Languages';
import {
  CATEGORIES, DEPARTMENTS, GENDERS, ORDINATION_LEVELS,
  HUYNH_TRUONG_ROLES, DOAN_SINH_ROLES, RANKS_MAP,
  MemberCategory, Department, OrdinationLevel,
} from '../Common/MemberEnums';

interface Props {
  onBack: () => void;
  onSave: (member: Partial<Member>) => void;
  isAdmin?: boolean;
}

const AddMemberScreen: React.FC<Props> = ({ onBack, onSave, isAdmin }) => {
  const [formData, setFormData] = useState<Partial<Member>>({
    fullName: '',
    dharmaName: '',
    gender: GENDERS[0],
    position: MemberCategory.HUYNH_TRUONG,
    department: Department.OANH,
    rank: RANKS_MAP[`${MemberCategory.HUYNH_TRUONG}`][0],
    role: HUYNH_TRUONG_ROLES[0],
    email: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    avatar: 'https://i.pravatar.cc/300?u=new',
    status: 'active',
    isOrdained: false,
    ordinationDate: '',
    ordinationLevel: '',
    promotionRank: 'Huynh trưởng Lộc Uyển'
  });
  const [error, setError] = useState<string | null>(null);

  const calculatePromotionRank = (data: Partial<Member>) => {
    if (data.position === MemberCategory.DOAN_SINH) {
      return Languages.get('screen.member_list.tab_doan_sinh');
    }

    if (data.position === MemberCategory.HUYNH_TRUONG) {
      if (data.isOrdained) {
        return data.ordinationLevel
          ? `${Languages.get('screen.member_list.tab_huynh_truong')} ${data.ordinationLevel}`
          : Languages.get('screen.edit_profile.promotion_ordained');
      } else {
        if (data.rank === "Kiên") return Languages.get('screen.edit_profile.promotion_loc_uyen');
        if (data.rank === "Trì") return Languages.get('screen.edit_profile.promotion_a_duc');
        return Languages.get('screen.add_member.promotion_unknown');
      }
    }
    return "";
  };

  const validateRank = (isOrdained: boolean, rank: string) => {
    if (!isOrdained && (rank === "Định" || rank === "Lực")) {
      setError(Languages.get('screen.add_member.error_invalid_rank'));
      return false;
    }
    setError(null);
    return true;
  };

  const handleChange = (field: keyof Member, value: any) => {
    let newData = { ...formData, [field]: value };

    if (field === 'position') {
      const key = value === MemberCategory.HUYNH_TRUONG
        ? MemberCategory.HUYNH_TRUONG
        : `${MemberCategory.DOAN_SINH}_${newData.department}`;

      const availableRanks = RANKS_MAP[key] || [];
      newData.rank = availableRanks[0] || "";
      newData.role = value === MemberCategory.HUYNH_TRUONG ? HUYNH_TRUONG_ROLES[0] : DOAN_SINH_ROLES[0];

      if (value !== MemberCategory.HUYNH_TRUONG) {
        newData.isOrdained = false;
        setError(null);
      }
    }

    if (field === 'department' && newData.position === MemberCategory.DOAN_SINH) {
      const key = `${MemberCategory.DOAN_SINH}_${value}`;
      const availableRanks = RANKS_MAP[key] || [];
      newData.rank = availableRanks[0] || "";
    }

    if (newData.position === MemberCategory.HUYNH_TRUONG) {
      validateRank(newData.isOrdained || false, newData.rank || '');
    }

    newData.promotionRank = calculatePromotionRank(newData);
    setFormData(newData);
  };

  const handleSave = () => {
    if (formData.position === MemberCategory.HUYNH_TRUONG && !formData.isOrdained && (formData.rank === "Định" || formData.rank === "Lực")) {
      setError(Languages.get('screen.add_member.error_check_rank'));
      return;
    }
    onSave(formData);
  };

  const currentRankKey = formData.position === MemberCategory.HUYNH_TRUONG
    ? MemberCategory.HUYNH_TRUONG
    : `${MemberCategory.DOAN_SINH}_${formData.department}`;
  const availableRanks = RANKS_MAP[currentRankKey] || [];
  const availableRoles = formData.position === MemberCategory.HUYNH_TRUONG ? HUYNH_TRUONG_ROLES : DOAN_SINH_ROLES;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Constants.IS_IOS ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcon name="arrow-back" size={24} color="#008A45" />
          </TouchableOpacity>
          <WText type="medium16" style={styles.headerTitle}>{Languages.get('screen.add_member.title')}</WText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: formData.avatar }} style={styles.avatarImage} />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <MaterialIcon name="photo-camera" size={16} color="#008A45" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <InputField label={Languages.get('screen.edit_profile.label_fullname')} value={formData.fullName || ''} onChange={(v) => handleChange('fullName', v)} />
            <InputField label={Languages.get('screen.edit_profile.label_dharma_name')} value={formData.dharmaName || ''} onChange={(v) => handleChange('dharmaName', v)} />
            <SelectField label={Languages.get('screen.edit_profile.label_gender')} value={formData.gender || GENDERS[0]} options={GENDERS} onChange={(v) => handleChange('gender', v)} />
            <SelectField label={Languages.get('screen.edit_profile.label_category')} value={formData.position || ''} options={CATEGORIES} onChange={(v) => handleChange('position', v)} />

            {formData.position === MemberCategory.HUYNH_TRUONG && (
              <View style={styles.ordainedSection}>
                <WText type="medium10" style={styles.sectionLabel}>{Languages.get('screen.edit_profile.label_ordination_status')}</WText>
                <View style={styles.ordainedRow}>
                  <TouchableOpacity onPress={() => handleChange('isOrdained', true)} style={styles.ordainedOption} activeOpacity={0.7}>
                    <View style={[styles.checkbox, formData.isOrdained && styles.checkboxActive]}>
                      {formData.isOrdained && <MaterialIcon name="check" size={14} color="#FFF" />}
                    </View>
                    <WText type="medium14" style={[styles.ordainedText, formData.isOrdained && styles.ordainedTextActive]}>{Languages.get('screen.edit_profile.ordination_yes')}</WText>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleChange('isOrdained', false)} style={styles.ordainedOption} activeOpacity={0.7}>
                    <View style={[styles.checkbox, !formData.isOrdained && styles.checkboxActive]}>
                      {!formData.isOrdained && <MaterialIcon name="check" size={14} color="#FFF" />}
                    </View>
                    <WText type="medium14" style={[styles.ordainedText, !formData.isOrdained && styles.ordainedTextActive]}>{Languages.get('screen.edit_profile.ordination_no')}</WText>
                  </TouchableOpacity>
                </View>

                {formData.isOrdained && (
                  <View style={styles.ordainedDetails}>
                    <InputField label={Languages.get('screen.edit_profile.label_ordination_date')} value={formData.ordinationDate || ''} onChange={(v) => handleChange('ordinationDate', v)} />
                    <SelectField label={Languages.get('screen.edit_profile.label_ordination_level')} value={formData.ordinationLevel || ''} options={ORDINATION_LEVELS} onChange={(v) => handleChange('ordinationLevel', v)} />
                  </View>
                )}
              </View>
            )}

            <SelectField label={Languages.get('screen.edit_profile.label_department')} value={formData.department || ''} options={DEPARTMENTS} onChange={(v) => handleChange('department', v)} />
            <SelectField label={Languages.get('screen.edit_profile.label_rank')} value={formData.rank || ''} options={availableRanks} onChange={(v) => handleChange('rank', v)} />

            {!!error && (
              <View style={styles.errorBox}>
                <MaterialIcon name="error-outline" size={18} color="#EF4444" />
                <WText type="medium11" style={styles.errorText}>{error}</WText>
              </View>
            )}

            <View style={styles.promotionSection}>
              <WText type="medium10" style={styles.sectionLabel}>{Languages.get('screen.edit_profile.label_promotion_rank')}</WText>
              <View style={styles.promotionBox}>
                <WText type="medium14" style={styles.promotionBoxText}>
                  {formData.promotionRank || Languages.get('screen.add_member.promotion_unknown')}
                </WText>
              </View>
            </View>

            <SelectField label={Languages.get('screen.edit_profile.label_role')} value={formData.role || ''} options={availableRoles} onChange={(v) => handleChange('role', v)} />
            <InputField label={Languages.get('screen.edit_profile.label_email')} value={formData.email || ''} onChange={(v) => handleChange('email', v)} />
            <InputField label={Languages.get('screen.edit_profile.label_phone')} value={formData.phone || ''} onChange={(v) => handleChange('phone', v)} />
            <InputField label={Languages.get('screen.edit_profile.label_join_date')} value={formData.joinDate || ''} onChange={(v) => handleChange('joinDate', v)} />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            style={styles.saveButton}
            activeOpacity={0.8}
          >
            <WText type="medium14" style={styles.saveButtonText}>
              {isAdmin ? Languages.get('screen.add_member.btn_admin_submit') : Languages.get('screen.add_member.btn_submit')}
            </WText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const InputField: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <View style={styles.fieldContainer}>
    <WText type="medium10" style={styles.fieldLabel}>{label}</WText>
    <View style={styles.inputBorder}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder={Languages.get('screen.add_member.placeholder_input')}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  </View>
);

const SelectField: React.FC<{ label: string, value: string, options: string[], onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <View style={styles.fieldContainer}>
    <WText type="medium10" style={styles.fieldLabel}>{label}</WText>
    <View style={styles.pickerBorder}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="__" value="" color="#9CA3AF" />
        {options.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
      </Picker>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#008A45',
    textTransform: 'uppercase',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
    alignSelf: 'center',
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    padding: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  formContainer: {
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  inputBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  textInput: {
    ...Style.textFontSize12,
    ...Style.textWeight400,
    ...Style.fontRegular,
    color: '#0f1011ff',
    padding: 0,
  },
  pickerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginLeft: -16,
    marginRight: -16,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  ordainedSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  ordainedRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  ordainedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
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
  checkboxActive: {
    backgroundColor: '#008A45',
    borderColor: '#008A45',
    borderWidth: 0,
  },
  ordainedText: {
    color: '#6B7280',
  },
  ordainedTextActive: {
    color: '#008A45',
  },
  ordainedDetails: {
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(0, 138, 69, 0.1)',
    marginTop: 8,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 24,
  },
  errorText: {
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
  promotionSection: {
    marginBottom: 24,
  },
  promotionBox: {
    backgroundColor: 'rgba(232, 245, 233, 0.5)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 138, 69, 0.2)',
    borderStyle: 'solid',
  },
  promotionBoxText: {
    color: '#008A45',
    textTransform: 'uppercase',
  },
  saveButton: {
    backgroundColor: '#008A45',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    letterSpacing: 2,
  }
});

export default AddMemberScreen;
