import { L } from "@src/lib/abpUtility";
import AppConsts from "@src/lib/appconst";

const rules = {
   no_kytudacbiet: {
	  pattern: /^(?![!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$)/,
	  message: L("khong_duoc_chua_ky_tu_dac_biet"),
   },
   MACAdress: {
	  pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
	  message: L("dia_chi_mac_khong_hop_le"),
   },
   noAllSpaces: {
	  validator: (_: any, value: any) => {
		 return new Promise<void>((resolve, reject) => {
			if (value && value.trim() === "") {
			   reject(L("khong_duoc_de_khoang_trang"));
			} else {
			   resolve();
			}
		 });
	  },
   },
   required: { required: true, message: L("Không được để trống!!!") },
   requiredNumber: {
	  pattern: /^(?:[1-9]\d*|0\.\d*[1-9]\d*)$/,
	  message: L("truong_nay_la_bat_buoc")
   },
   requiredImage: { required: true, message: L("anh_la_bat_buoc") },
   messageForNumber: { required: true, message: L("khong_de_trong_va_chi_nhap_so_nguyen_duong") },
   noSpaces: {
	  pattern: /^\S*$/,
	  message: L("khong_duoc_chua_khoang_trang"),
   },
   maxName: {
	  max: AppConsts.maxLength.name,
	  message: L("nhap_qua_so_luong_ky_tu"),
   },
   maxCodeBank: {
	  max: AppConsts.maxLength.code,
	  message: L("nhap_qua_so_luong_ky_tu"),
   },
   mediaName: {
	  max: AppConsts.maxLength.mediaName,
	  message: L("nhap_qua_so_luong_ky_tu"),
   },
   maxPrice: {
	  max: AppConsts.maxLength.price,
	  message: L("nhap_qua_so_tien_quy_dinh"),
   },
   emailAddress: {
	  max: AppConsts.maxLength.email,
	  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g,
	  message: L("email_khong_dung"),
   },

   cccd: {
	  pattern: /^[0-9]{12}$/,
	  message: L("so_can_cuoc_cong_dan_khong_hop_le"),
   },
   rfMoney: {
	  pattern: /^([1-9]\d{0,6}|0)$/,
	  message: L("so_tien_vuot_nguong_cho_phep"),
   },
   address: {
	  pattern: /^[a-zA-Z0-9\s]{4,}$/,
	  message: L("it_nhat_5_ky_tu"),
   },
   phone: {
	  max: AppConsts.maxLength.phone,
	  pattern: /^[\+]?[(]?[0-9]{1,3}[)]?[\ ]?[-\s\.]?[0-9]{9}$/,
	  message: L("so_dien_thoai_khong_hop_le"),
   },
   password: {
	  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,32}$/,
	  min: AppConsts.maxLength.password,
	  message: L("mat_khau_phai_chua_it_nhat_8_ky_tu_va_chua_chu_hoa_chu_thuong"),
   },
   description: {
	  max: AppConsts.maxLength.description,
	  message: L("nhap_qua_so_luong_ky_tu"),
   },
   codeSoft: {
	  max: AppConsts.maxLength.codeSoft,
	  message: L("nhap_qua_so_luong_ky_tu"),
   },
   userName: (value: any) => {
	  if (!value) {
		 return Promise.reject(L('vui_long_nhap_ten_nguoi_lien_he'));
	  }
	  if (!/^[\p{L}]/u.test(value)) {
		 return Promise.reject(L('ky_tu_dau_tien_phai_la_chu'));
	  }
	  return Promise.resolve();
   },

   checkEmail: (value: any) => {
	  if (!value) {
		 return Promise.reject(L('truong_nay_la_bat_buoc'));
	  }
	  if (!/^\S+@\S+\.\S+$/.test(value)) {
		 return Promise.reject(L('email_khong_dung'));
	  }
	  return Promise.resolve();
   },
   chucai_so_kytudacbiet: {
	  // pattern: /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()+]*$/,
	  pattern: /^[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zA-Z0-9àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ!@#$%^&*()+_ ]*$/,
	  message: L("khong_hop_le"),
   },
   chucai_so: {
	  // pattern: /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()+]*$/,
	  pattern: /^[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zA-Z0-9àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ_ ]*$/,
	  message: L("khong_hop_le"),
   },
   so_kytudacbiet: {
	  pattern: /^[0-9!@#$%^&*()+_ ]*$/,
	  message: L("khong_hop_le"),
   },
   onlyLetter: {
	  pattern: /^[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ_ ]*$/,
	  message: L("khong_hop_le"),
   },
   numberOnly: {
	  pattern: /^[0-9]\d*$/,
	  message: L("chi_nhap_ky_tu_so"),
   },
   website: {
	  pattern: /^[a-zA-Z0-9!@#$%^&*()+_./]*$/,
	  message: L("khong_hop_le"),
   },
   no_number: {
	  pattern: /^(?=.*[^\d])[\s\S]*$/,
	  message: L("khong_hop_le"),
   },
   gioi_han_ten: {
	  max: AppConsts.maxLength.ten,
	  message: L("nhap_qua_so_luong_ky_tu"),
   },
   maxNameBank: {
	  max: AppConsts.maxLength.address,
	  message: L("nhap_qua_so_luong_ky_tu"),
   },
   layout: {
	  pattern: /^(\d+)(\|\d+)*$/,
	  message: L("Kiểu bố cục khong_hop_le!"),
   },
   maxLengthLayout: {
	  max: AppConsts.maxLength.layout,
	  message: L('nhap_qua_so_luong_ky_tu'),
   },
};

export default rules;
