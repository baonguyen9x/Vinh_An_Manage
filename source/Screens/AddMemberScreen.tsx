import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Member } from '../../types';
import { MaterialIcon } from '../Common/Utils';

interface Props {
  onBack: () => void;
  onSave: (member: Partial<Member>) => void;
}

const CATEGORIES = ["Huynh trưởng", "Đoàn sinh"];
const DEPARTMENTS = ["Ngành Oanh", "Ngành Thiếu", "Ngành Thanh"];
const GENDERS: ("Nam" | "Nữ")[] = ["Nam", "Nữ"];
const ORDINATION_LEVELS = ["Cấp Tập", "Cấp Tín", "Cấp Tấn", "Cấp Dũng"];

const HUYNH_TRUONG_ROLES = ["Đoàn trưởng", "Đoàn phó", "Liên đoàn trưởng", "Liên đoàn phó", "Thư ký", "Thủ quỷ", "Gia trưởng"];
const DOAN_SINH_ROLES = ["Đoàn sinh", "Đội trưởng", "Đội phó", "Chúng trưởng", "Chúng phó", "Đầu đàn", "Thứ đàn"];

const RANKS_MAP: Record<string, string[]> = {
  "Đoàn sinh_Ngành Oanh": ["Mở mắt", "Cánh mềm", "Chân cứng", "Tung bay"],
  "Đoàn sinh_Ngành Thiếu": ["Hướng Thiện", "Sơ Thiện", "Trung Thiện", "Chánh Thiện"],
  "Đoàn sinh_Ngành Thanh": ["Hoà", "Minh", "Kiên", "Trực"],
  "Huynh trưởng": ["Kiên", "Trì", "Định", "Lực"]
};

const AddMemberScreen: React.FC<Props> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState<Partial<Member>>({
    fullName: '',
    dharmaName: '',
    gender: 'Nam',
    position: 'Huynh trưởng',
    department: 'Ngành Oanh',
    rank: 'Kiên',
    role: 'Gia trưởng',
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
    if (data.position === "Đoàn sinh") return "Đoàn sinh";

    if (data.position === "Huynh trưởng") {
      if (data.isOrdained) {
        return data.ordinationLevel ? `Huynh trưởng ${data.ordinationLevel}` : "Đã thọ cấp";
      } else {
        if (data.rank === "Kiên") return "Huynh trưởng Lộc Uyển";
        if (data.rank === "Trì") return "Huynh trưởng A Dục";
        return "Chưa xác định";
      }
    }
    return "";
  };

  const validateRank = (isOrdained: boolean, rank: string) => {
    if (!isOrdained && (rank === "Định" || rank === "Lực")) {
      setError("Bậc Định và Lực yêu cầu phải thọ cấp mới có thể chọn.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleChange = (field: keyof Member, value: any) => {
    let newData = { ...formData, [field]: value };

    if (field === 'position') {
      const key = value === "Huynh trưởng" ? "Huynh trưởng" : `Đoàn sinh_${newData.department}`;
      const availableRanks = RANKS_MAP[key] || [];
      newData.rank = availableRanks[0] || "";
      newData.role = value === "Huynh trưởng" ? HUYNH_TRUONG_ROLES[0] : DOAN_SINH_ROLES[0];
      if (value !== "Huynh trưởng") {
        newData.isOrdained = false;
        setError(null);
      }
    }

    if (field === 'department' && newData.position === "Đoàn sinh") {
      const key = `Đoàn sinh_${value}`;
      const availableRanks = RANKS_MAP[key] || [];
      newData.rank = availableRanks[0] || "";
    }

    if (newData.position === "Huynh trưởng") {
      validateRank(newData.isOrdained || false, newData.rank || '');
    }

    newData.promotionRank = calculatePromotionRank(newData);
    setFormData(newData);
  };

  const handleSave = () => {
    if (formData.position === "Huynh trưởng" && !formData.isOrdained && (formData.rank === "Định" || formData.rank === "Lực")) {
      setError("Không thể gửi. Vui lòng kiểm tra lại bậc học.");
      return;
    }
    onSave(formData);
  };

  const currentRankKey = formData.position === "Huynh trưởng" ? "Huynh trưởng" : `Đoàn sinh_${formData.department}`;
  const availableRanks = RANKS_MAP[currentRankKey] || [];
  const availableRoles = formData.position === "Huynh trưởng" ? HUYNH_TRUONG_ROLES : DOAN_SINH_ROLES;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcon name="arrow-back" size={24} color="#008A45" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thêm Thành Viên</Text>
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
            <InputField label="Họ tên" value={formData.fullName || ''} onChange={(v) => handleChange('fullName', v)} />
            <InputField label="Pháp danh" value={formData.dharmaName || ''} onChange={(v) => handleChange('dharmaName', v)} />
            <SelectField label="Giới tính" value={formData.gender || 'Nam'} options={GENDERS} onChange={(v) => handleChange('gender', v)} />
            <SelectField label="Phân loại" value={formData.position || ''} options={CATEGORIES} onChange={(v) => handleChange('position', v)} />

            {formData.position === "Huynh trưởng" && (
              <View style={styles.ordainedSection}>
                <Text style={styles.sectionLabel}>Tình trạng thọ cấp</Text>
                <View style={styles.ordainedRow}>
                  <TouchableOpacity onPress={() => handleChange('isOrdained', true)} style={styles.ordainedOption} activeOpacity={0.7}>
                    <View style={[styles.checkbox, formData.isOrdained && styles.checkboxActive]}>
                      {formData.isOrdained && <MaterialIcon name="check" size={14} color="#FFF" />}
                    </View>
                    <Text style={[styles.ordainedText, formData.isOrdained && styles.ordainedTextActive]}>Đã thọ cấp</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleChange('isOrdained', false)} style={styles.ordainedOption} activeOpacity={0.7}>
                    <View style={[styles.checkbox, !formData.isOrdained && styles.checkboxActive]}>
                      {!formData.isOrdained && <MaterialIcon name="check" size={14} color="#FFF" />}
                    </View>
                    <Text style={[styles.ordainedText, !formData.isOrdained && styles.ordainedTextActive]}>Chưa thọ cấp</Text>
                  </TouchableOpacity>
                </View>

                {formData.isOrdained && (
                  <View style={styles.ordainedDetails}>
                    <InputField label="Ngày thọ cấp" value={formData.ordinationDate || ''} onChange={(v) => handleChange('ordinationDate', v)} />
                    <SelectField label="Cấp thọ nhận" value={formData.ordinationLevel || ''} options={ORDINATION_LEVELS} onChange={(v) => handleChange('ordinationLevel', v)} />
                  </View>
                )}
              </View>
            )}

            <SelectField label="Ngành" value={formData.department || ''} options={DEPARTMENTS} onChange={(v) => handleChange('department', v)} />
            <SelectField label="Bậc học" value={formData.rank || ''} options={availableRanks} onChange={(v) => handleChange('rank', v)} />

            {!!error && (
              <View style={styles.errorBox}>
                <MaterialIcon name="error-outline" size={18} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.promotionSection}>
              <Text style={styles.sectionLabel}>Cấp bậc (Tự động)</Text>
              <View style={styles.promotionBox}>
                <Text style={styles.promotionBoxText}>
                  {formData.promotionRank || "Chưa xác định"}
                </Text>
              </View>
            </View>

            <SelectField label="Chức vụ" value={formData.role || ''} options={availableRoles} onChange={(v) => handleChange('role', v)} />
            <InputField label="Email" value={formData.email || ''} onChange={(v) => handleChange('email', v)} />
            <InputField label="Số điện thoại" value={formData.phone || ''} onChange={(v) => handleChange('phone', v)} />
            <InputField label="Ngày bắt đầu sinh hoạt" value={formData.joinDate || ''} onChange={(v) => handleChange('joinDate', v)} />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            style={styles.saveButton}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>GỬI YÊU CẦU THÊM</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const InputField: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputBorder}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder="Nhập..."
        placeholderTextColor="#9CA3AF"
      />
    </View>
  </View>
);

const SelectField: React.FC<{ label: string, value: string, options: string[], onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.pickerBorder}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Chọn..." value="" color="#9CA3AF" />
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
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 10,
    fontWeight: '900',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
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
    fontSize: 10,
    fontWeight: '900',
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
  },
  ordainedText: {
    fontSize: 14,
    fontWeight: 'bold',
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
    fontSize: 11,
    fontWeight: 'bold',
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
    borderStyle: 'dashed',
  },
  promotionBoxText: {
    color: '#008A45',
    fontWeight: 'bold',
    fontSize: 14,
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
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
  }
});

export default AddMemberScreen;
