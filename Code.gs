// ==========================================
// MÃ NGUỒN GOOGLE APPS SCRIPT KẾT NỐI VỚI GOOGLE SHEET
// ==========================================

// 1. CẤU HÌNH THÔNG TIN CỦA BẠN (Chỉnh sửa tại đây)
var TARGET_EMAIL = "abc@gmail.com"; // Điền email nhận thông báo của bạn
var SHEET_NAME = "Trang tính1";          // Điền tên tab Sheet mà bạn muốn lưu dữ liệu

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    // Nếu sheet không tồn tại, mặc định lấy sheet đầu tiên
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    }

    var rowData = [];
    
    // 1. Cột A: STT (Số thứ tự)
    // getLastRow() trả về dòng cuối cùng có dữ liệu. Nếu bảng mới tạo có 1 dòng tiêu đề thì dòng tiếp theo là 2, STT sẽ là 2-1 = 1.
    var stt = sheet.getLastRow(); 
    if (stt === 0) stt = 1; 
    rowData.push(stt);
    
    // 2. Cột B: Họ tên
    rowData.push(e.parameter.name || "");
    
    // 3. Cột C: Gmail
    rowData.push(e.parameter.email || "");
    
    // 4. Cột D: Số điện thoại (Chèn thêm dấu ngoặc nháy đơn để Google Sheet giữ nguyên dạng chữ số, không làm mất số 0 ở đầu)
    var phone = e.parameter.phone || "";
    rowData.push("'" + phone);
    
    // 5. Cột E: Sản phẩm quan tâm
    rowData.push(e.parameter.product || "");
    
    // 6. Cột F: Thời gian đăng ký (Đã cấu hình múi giờ Việt Nam UTC+7)
    var now = new Date();
    // Sử dụng múi giờ GMT+7 của Việt Nam
    var timestamp = Utilities.formatDate(now, "GMT+7", "HH:mm:ss dd/MM/yyyy");
    rowData.push(timestamp);
    
    // Thực thi ghi nguyên cả 1 hàng dữ liệu rowData vào File Google Sheet
    sheet.appendRow(rowData);
    
    // THỰC THI GỬI EMAIL THÔNG BÁO CHO QUẢN TRỊ VIÊN
    var emailSubject = "🔥 CÓ KHÁCH HÀNG MỚI (MIPEC TỐ HỮU)";
    var emailBody = "Bạn vừa nhận được thông tin khách hàng tiềm năng mới trên Website:\n\n" +
                    "👤 Họ tên: " + e.parameter.name + "\n" +
                    "📞 Số điện thoại: " + phone + "\n" +
                    "✉️ Email: " + (e.parameter.email ? e.parameter.email : "Không cung cấp") + "\n" +
                    "🏢 Sản phẩm quan tâm: " + e.parameter.product + "\n" +
                    "⏱ Thời gian đăng ký: " + timestamp + "\n\n" +
                    "📋 Xem danh sách khách hàng: " + "LINK_GOOGLE_SHEET_CUA_BAN" + "\n" +
                    "Hãy nhanh chóng liên hệ với khách để hỗ trợ tốt nhất!";
                    
    MailApp.sendEmail({
      to: TARGET_EMAIL,
      subject: emailSubject,
      body: emailBody
    });

    // Trả về văn bản để báo hiệu cho Frontend là đã hoàn tất
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    // Trả về Exception nếu hệ thống Apps Script gặp lỗi (để Debug dễ hơn)
    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
