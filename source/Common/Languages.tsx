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
      'splash.title': 'Gia Đình Phật Tử\nVĩnh An',
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
