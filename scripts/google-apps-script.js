/**
 * GOOGLE APPS SCRIPT - TỰ ĐỘNG LƯU PHẢN HỒI THIỆP CƯỚI VÀO GOOGLE SHEET
 * Bảng tính: https://docs.google.com/spreadsheets/d/18ZRmmnf7wJhgfRVMqxJewOLsps4IPV9J--CqG1lPtLo/edit
 * 
 * HƯỚNG DẪN 3 BƯỚC THIẾT LẬP (Chỉ mất 30 giây):
 * 1. Mở file Google Sheet trên, chọn menu "Tiện ích mở rộng" (Extensions) -> "Apps Script".
 * 2. Xóa hết code mặc định và dán toàn bộ đoạn mã này vào. Bấm biểu tượng Lưu (Ctrl+S / Cmd+S).
 * 3. Bấm nút "Triển khai" (Deploy) màu xanh ở góc phải trên -> "Triển khai mới" (New deployment):
 *    - Chọn loại: "Ứng dụng web" (Web app)
 *    - Mô tả: RSVP Thiệp Cưới Nam & Hiệp
 *    - Thực thi dưới tên: "Tôi" (Me)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Anyone)
 *    - Bấm "Triển khai" -> Cấp quyền (Chọn Advanced -> Go to Untitled project (unsafe)) -> Sao chép URL ứng dụng web (có đuôi /exec).
 *    - Dán URL vừa sao chép vào trang quản trị thiệp (#invite) hoặc file src/config/weddingConfig.ts.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Khóa tránh xung đột khi nhiều người gửi cùng lúc
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Tự động tạo dòng tiêu đề nếu bảng tính còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Gửi",
        "Họ Và Tên",
        "Trạng Thái Tham Dự",
        "Số Lượng Khách",
        "Số Điện Thoại",
        "Lời Chúc / Lời Nhắn",
        "Nguồn Gửi"
      ]);

      // Định dạng dòng tiêu đề sang trọng tone thiệp cưới
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setBackground("#F3D5DA");
      headerRange.setFontColor("#5A2D3A");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
    }

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    var name = data.name || "Khách mời";
    var status = data.status || "Chưa rõ";
    var count = data.count !== undefined ? data.count : 1;
    var phone = data.phone ? "'" + data.phone : ""; // Thêm dấu ' để tránh mất số 0 đầu số điện thoại
    var message = data.message || "";
    var source = data.source || "Thiệp cưới online Nam & Hiệp";

    // Thêm dòng mới vào Google Sheet
    sheet.appendRow([
      timestamp,
      name,
      status,
      count,
      phone,
      message,
      source
    ]);

    // Canh chỉnh dòng vừa thêm
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 3).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 4).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 5).setHorizontalAlignment("center");

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", message: "Wedding RSVP Google Apps Script Endpoint is ready!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
