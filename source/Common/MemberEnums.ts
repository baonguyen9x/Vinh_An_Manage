// ─────────────────────────────────────────────────────────────
//  MemberEnums.ts  –  Tất cả enums & constants dữ liệu thành viên
// ─────────────────────────────────────────────────────────────

/** Giới tính */
export const GENDERS: ('Nam' | 'Nữ')[] = ['Nam', 'Nữ'];

/** Phân loại (position) */
export enum MemberCategory {
    HUYNH_TRUONG = 'Huynh trưởng',
    DOAN_SINH = 'Đoàn sinh',
}
export const CATEGORIES: MemberCategory[] = [
    MemberCategory.HUYNH_TRUONG,
    MemberCategory.DOAN_SINH,
];

/** Ngành (department) */
export enum Department {
    OANH = 'Ngành Oanh',
    THIEU = 'Ngành Thiếu',
    THANH = 'Ngành Thanh',
}
export const DEPARTMENTS: Department[] = [
    Department.OANH,
    Department.THIEU,
    Department.THANH,
];

/** Cấp thọ nhận khi thọ cấp */
export enum OrdinationLevel {
    CAP_TAP = 'Cấp Tập',
    CAP_TIN = 'Cấp Tín',
    CAP_TAN = 'Cấp Tấn',
    CAP_DUNG = 'Cấp Dũng',
}
export const ORDINATION_LEVELS: OrdinationLevel[] = [
    OrdinationLevel.CAP_TAP,
    OrdinationLevel.CAP_TIN,
    OrdinationLevel.CAP_TAN,
    OrdinationLevel.CAP_DUNG,
];

/** Chức vụ Huynh trưởng */
export enum HuynhTruongRole {
    DOAN_TRUONG = 'Đoàn trưởng',
    DOAN_PHO = 'Đoàn phó',
    LIEN_DOAN_TRUONG = 'Liên đoàn trưởng',
    LIEN_DOAN_PHO = 'Liên đoàn phó',
    THU_KY = 'Thư ký',
    THU_QUY = 'Thủ quỷ',
    GIA_TRUONG = 'Gia trưởng',
}
export const HUYNH_TRUONG_ROLES: HuynhTruongRole[] = [
    HuynhTruongRole.DOAN_TRUONG,
    HuynhTruongRole.DOAN_PHO,
    HuynhTruongRole.LIEN_DOAN_TRUONG,
    HuynhTruongRole.LIEN_DOAN_PHO,
    HuynhTruongRole.THU_KY,
    HuynhTruongRole.THU_QUY,
    HuynhTruongRole.GIA_TRUONG,
];

/** Chức vụ Đoàn sinh */
export enum DoanSinhRole {
    DOAN_SINH = 'Đoàn sinh',
    DOI_TRUONG = 'Đội trưởng',
    DOI_PHO = 'Đội phó',
    CHUNG_TRUONG = 'Chúng trưởng',
    CHUNG_PHO = 'Chúng phó',
    DAU_DAN = 'Đầu đàn',
    THU_DAN = 'Thứ đàn',
}
export const DOAN_SINH_ROLES: DoanSinhRole[] = [
    DoanSinhRole.DOAN_SINH,
    DoanSinhRole.DOI_TRUONG,
    DoanSinhRole.DOI_PHO,
    DoanSinhRole.CHUNG_TRUONG,
    DoanSinhRole.CHUNG_PHO,
    DoanSinhRole.DAU_DAN,
    DoanSinhRole.THU_DAN,
];

/** Bậc học theo ngành & phân loại */
export const RANKS_MAP: Record<string, string[]> = {
    [`${MemberCategory.DOAN_SINH}_${Department.OANH}`]: ['Mở mắt', 'Cánh mềm', 'Chân cứng', 'Tung bay'],
    [`${MemberCategory.DOAN_SINH}_${Department.THIEU}`]: ['Hướng Thiện', 'Sơ Thiện', 'Trung Thiện', 'Chánh Thiện'],
    [`${MemberCategory.DOAN_SINH}_${Department.THANH}`]: ['Hoà', 'Minh', 'Kiên', 'Trực'],
    [MemberCategory.HUYNH_TRUONG]: ['Kiên', 'Trì', 'Định', 'Lực'],
};

/** Trạng thái tài khoản */
export enum MemberStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ON_LEAVE = 'on_leave',
}

/** Lấy danh sách roles theo phân loại */
export const getRolesByCategory = (category: string): string[] => {
    return category === MemberCategory.HUYNH_TRUONG ? HUYNH_TRUONG_ROLES : DOAN_SINH_ROLES;
};

/** Lấy danh sách ranks theo khóa */
export const getRankKey = (category: string, department: string): string => {
    return category === MemberCategory.HUYNH_TRUONG
        ? MemberCategory.HUYNH_TRUONG
        : `${MemberCategory.DOAN_SINH}_${department}`;
};
