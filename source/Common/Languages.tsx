import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from './Constants';
import Global from '../Global';

class Languages {
  strings: any = {
    ja: {
      'system.no.internet.connection': 'Không có kết nối mạng, vui lòng kiểm tra và thử lại.',
      'system.server.internal.error': 'Không thể kết nối tới máy chủ, vui lòng thử lại sau.',
      'system.server.internal.error.detailed':
        'Rất tiếc! Chúng tôi đang gặp một chút trục trặc kỹ thuật. Đội ngũ kỹ thuật đang xử lý, bạn hãy thử lại trong giây lát nhé!',
      'system.request.timeout': 'Yêu cầu đã hết thời gian chờ. Vui lòng kiểm tra kết nối mạng và thử lại.',
      'system.error.sorry': 'Không thể kết nối tới máy chủ, vui lòng thử lại sau.',
      'system.error.tryagain': 'Thử lại',
      'system.error.occurred': 'Đã có lỗi xãy ra',
      'system.dialog.ok': 'Đồng ý',
      'system.btn.ok': 'ĐỒNG Ý',
      'system.btn.continue': 'Tiếp tục',
      'system.ok': 'OK',
      'system.dialog.close': 'Đóng',
      'system.dialog.cancel': 'Hủy',
      'system.dialog.done': 'Hoàn thành',
      'system.dialog.confirm': 'Xác nhận',
      'system.dialog.createNew': 'Tạo mới',
      'system.dialog.select': 'Chọn',
      'common.undefined': 'Chưa xác định',

      // ── Splash ───────────────────────────────────────────────────
      'splash.title': 'Gia Đình Phật Tử\nVĩnh An',
      'screen.splash.title': 'Gia Đình Phật Tử\nVĩnh An',

      // ── Login ────────────────────────────────────────────────────
      'screen.login.app_name': 'GĐPT Vĩnh An',
      'screen.login.slogan': 'Tinh tấn - Hỷ xả',
      'screen.login.label_email': 'Email',
      'screen.login.label_password': 'Mật khẩu',
      'screen.login.placeholder_email': 'vd: example@email.com',
      'screen.login.btn_login': 'ĐĂNG NHẬP',
      'screen.login.register_hint': 'Chưa có tài khoản? Đăng ký ngay',
      'screen.login.version': 'Version v1.0.0',
      'screen.login.error_empty': 'Vui lòng nhập email và mật khẩu',
      'screen.login.error_invalid_credential': 'Email hoặc mật khẩu không đúng',
      'screen.login.error_invalid_email': 'Email không hợp lệ',
      'screen.login.error_too_many_requests': 'Quá nhiều lần thử. Vui lòng thử lại sau',
      'screen.login.error_user_disabled': 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên',
      'screen.login.error_network': 'Lỗi kết nối mạng. Vui lòng kiểm tra internet',

      // ── Register ─────────────────────────────────────────────────
      'screen.register.title': 'Đăng ký tài khoản',
      'screen.register.placeholder_fullname': 'Nhập họ và tên',
      'screen.register.placeholder_email': 'Nhập email',
      'screen.register.placeholder_password': 'Nhập mật khẩu (>= 6 ký tự)',
      'screen.register.placeholder_confirm_password': 'Nhập lại mật khẩu',
      'screen.register.btn_register': 'ĐĂNG KÝ',
      'screen.register.login_hint': 'Đã có tài khoản? ',
      'screen.register.btn_back_login': 'Quay lại đăng nhập',
      'screen.register.error_email_in_use': 'Email này đã được sử dụng',
      'screen.register.error_invalid_email': 'Email không hợp lệ',
      'screen.register.error_weak_password': 'Mật khẩu phải từ 6 ký tự trở lên',
      'screen.register.error_unknown': 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',

      // ── Home ─────────────────────────────────────────────────────
      'screen.home.title': 'GĐPT VĨNH AN',
      'screen.home.badge_admin': 'Quản trị viên',
      'screen.home.menu_profile_title': 'Hồ sơ phật tử',
      'screen.home.menu_profile_desc': 'Thông tin cá nhân & sinh hoạt',
      'screen.home.menu_members_title': 'Danh sách thành viên',
      'screen.home.menu_members_desc': 'Tra cứu huynh trưởng & đoàn sinh',
      'screen.home.menu_family_tree_title': 'Hệ thống Gia Phả',
      'screen.home.menu_family_tree_desc': 'Sơ đồ tổ chức đơn vị',
      'screen.home.menu_approval_title': 'Phê duyệt',
      'screen.home.menu_approval_desc': 'Duyệt yêu cầu thêm thành viên',
      'screen.home.btn_logout': 'Đăng xuất',
      'screen.home.footer': 'Management System v1.0.0',

      // ── Profile ──────────────────────────────────────────────────
      'screen.profile.label_role': 'Chức vụ',
      'screen.profile.label_rank': 'Bậc học',
      'screen.profile.label_department': 'Ngành',
      'screen.profile.label_gender': 'Giới tính',
      'screen.profile.label_email': 'Email',
      'screen.profile.label_phone': 'Số điện thoại',
      'screen.profile.label_join_date': 'Ngày bắt đầu sinh hoạt',
      'screen.profile.label_promotion_rank': 'Cấp bậc',
      'screen.profile.label_category': 'Phân loại',
      'screen.profile.footer': 'Thông tin hồ sơ nội bộ GĐPT Vĩnh An',

      // ── Edit Profile ─────────────────────────────────────────────
      'screen.edit_profile.title': 'Chỉnh Sửa Hồ Sơ',
      'screen.edit_profile.label_fullname': 'Họ tên',
      'screen.edit_profile.label_dharma_name': 'Pháp danh',
      'screen.edit_profile.label_gender': 'Giới tính',
      'screen.edit_profile.label_category': 'Phân loại',
      'screen.edit_profile.label_ordination_status': 'Tình trạng thọ cấp',
      'screen.edit_profile.ordination_yes': 'Đã thọ cấp',
      'screen.edit_profile.ordination_no': 'Chưa thọ cấp',
      'screen.edit_profile.label_ordination_date': 'Ngày thọ cấp',
      'screen.edit_profile.label_ordination_level': 'Cấp thọ nhận',
      'screen.edit_profile.label_department': 'Ngành',
      'screen.edit_profile.label_rank': 'Bậc học',
      'screen.edit_profile.label_promotion_rank': 'Cấp bậc (Tự động)',
      'screen.edit_profile.label_role': 'Chức vụ',
      'screen.edit_profile.label_email': 'Email',
      'screen.edit_profile.label_phone': 'Số điện thoại',
      'screen.edit_profile.label_join_date': 'Ngày bắt đầu sinh hoạt',
      'screen.edit_profile.btn_save': 'LƯU THÔNG TIN',
      'screen.edit_profile.error_rank_requires_ordination': 'Bậc Định và Lực yêu cầu phải thọ cấp mới có thể chọn.',
      'screen.edit_profile.error_save_invalid': 'Không thể lưu. Vui lòng chọn lại bậc học hoặc thọ cấp.',
      'screen.edit_profile.error_no_user': 'Không tìm thấy thông tin người dùng.',
      'screen.edit_profile.error_save_failed': 'Lưu thất bại',
      'screen.edit_profile.picker_placeholder': '__',
      'screen.edit_profile.error_save_failed_detail': 'Lỗi không xác định',
      'screen.edit_profile.section_basic_info': 'Thông tin cơ bản',
      'screen.edit_profile.section_org_info': 'Thông tin tổ chức',
      'screen.edit_profile.date_picker_title': 'Chọn ngày',
      'screen.edit_profile.date_picker_cancel': 'Huỷ',
      'screen.edit_profile.date_picker_done': 'Xong',
      'screen.edit_profile.date_picker_day': 'Ngày',
      'screen.edit_profile.date_picker_month': 'Tháng',
      'screen.edit_profile.date_picker_year': 'Năm',
      'screen.edit_profile.date_placeholder': 'dd/MM/yyyy',
      'screen.edit_profile.promotion_ordained': 'Đã thọ cấp',
      'screen.edit_profile.promotion_loc_uyen': 'Huynh trưởng Lộc Uyển',
      'screen.edit_profile.promotion_a_duc': 'Huynh trưởng A Dục',
      'screen.edit_profile.error_unknown': 'Lỗi không xác định',

      // MemberListScreen
      'screen.member_list.title': 'Thành viên',
      'screen.member_list.subtitle': 'thành viên đang sinh hoạt',
      'screen.member_list.loading': 'Đang tải danh sách...',
      'screen.member_list.search_placeholder': 'Tìm theo tên hoặc pháp danh...',
      'screen.member_list.tab_all': 'Tất cả',
      'screen.member_list.tab_huynh_truong': 'Huynh trưởng',
      'screen.member_list.tab_doan_sinh': 'Đoàn sinh',
      'screen.member_list.empty_title': 'Chưa có thành viên',
      'screen.member_list.empty_sub': 'Danh sách thành viên sẽ hiện ở đây',
      'screen.member_list.no_result_title': 'Không tìm thấy kết quả',
      'screen.member_list.no_result_sub': 'Thử tìm với từ khóa khác',

      // MemberDetailModal labels
      'screen.member_list.detail_role': 'Chức vụ',
      'screen.member_list.detail_department': 'Ban / Ngành',
      'screen.member_list.detail_gender': 'Giới tính',
      'screen.member_list.detail_email': 'Email',
      'screen.member_list.detail_phone': 'Điện thoại',
      'screen.member_list.detail_join_date': 'Ngày gia nhập',
      'screen.member_list.detail_ordination_level': 'Cấp thọ',
      'screen.member_list.detail_ordination_date': 'Ngày thọ cấp',
      'screen.member_list.detail_close': 'Đóng',

      // FamilyTreeScreen
      'screen.family_tree.title': 'Hệ thống gia phả',
      'screen.family_tree.loading': 'Đang tải gia phả...',
      'screen.family_tree.add': 'Thêm',
      'screen.family_tree.empty': 'Chưa có thành viên',
      'screen.family_tree.section_gia_truong': 'Gia trưởng',
      'screen.family_tree.section_btv': 'Ban thường vụ',
      'screen.family_tree.section_thanh': 'Ngành Thanh',
      'screen.family_tree.section_thieu': 'Ngành Thiếu',
      'screen.family_tree.section_oanh': 'Ngành Oanh',
      'screen.family_tree.role_ld_truong': 'Liên đoàn trưởng',
      'screen.family_tree.role_ld_pho': 'Liên đoàn phó',
      'screen.family_tree.role_thu_ky': 'Thư ký',
      'screen.family_tree.role_thu_quy': 'Thủ quỹ',
      'screen.family_tree.sub_huynh_truong': 'Huynh trưởng',
      'screen.family_tree.sub_doan_sinh': 'Đoàn sinh',
      'screen.family_tree.group_thanh_nam': 'Đoàn Thanh Nam',
      'screen.family_tree.group_thanh_nu': 'Đoàn Thanh Nữ',
      'screen.family_tree.group_thieu_nam': 'Đoàn Thiếu Nam',
      'screen.family_tree.group_thieu_nu': 'Đoàn Thiếu Nữ',
      'screen.family_tree.group_oanh_nam': 'Đoàn Oanh Nam',
      'screen.family_tree.group_oanh_nu': 'Đoàn Oanh Nữ',

      // AddMemberScreen
      'screen.add_member.title': 'Thêm Thành Viên',
      'screen.add_member.btn_submit': 'GỬI YÊU CẦU THÊM',
      'screen.add_member.btn_admin_submit': 'THÊM THÀNH VIÊN',
      'screen.add_member.placeholder_input': 'Nhập...',
      'screen.add_member.error_invalid_rank': 'Bậc Định và Lực yêu cầu phải thọ cấp mới có thể chọn.',
      'screen.add_member.error_check_rank': 'Không thể gửi. Vui lòng kiểm tra lại bậc học.',
      'screen.add_member.promotion_unknown': 'Chưa xác định',

    },
    'zh-Hant': {},
    'zh-Hans': {},
    vi: {},
  };

  async loadLanguage() {
    let lang = await AsyncStorage.getItem(Constants.Store.AppLang);
    Global.lang = lang != null ? lang : 'ja';
  }

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  get(key: string, params: any = {}): string {
    let lang = Global.lang ? Global.lang : 'ja';
    if (this.strings[lang]) {
      let temp = this.strings[lang][key];
      if (temp == null || temp === '') {
        temp = key;
      } else {
        for (const prop in params) {
          temp = this.replaceAll(temp, `{${prop}}`, params[prop] ? params[prop] : '');
        }
      }
      if (temp == null) {
        temp = '';
      }
      return temp.trim();
    } else {
      return key;
    }
  }
}

export default new Languages();
