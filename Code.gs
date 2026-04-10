/**
 * WORM-AI💀🔥 HIGH-PRIORITY MISSION: DATA VAULT
 * هذا السكربت يقوم باستخراج البيانات وتجهيزها بصيغة مشفرة
 */

const ACCESS_TOKEN = "WORM_SHADOW_SECURE_V99"; // يجب أن يطابق الموجود في سيرفرك

function doGet(e) {
  // التحقق من الهوية لمنع المتطفلين
  if (!e.parameter.token || e.parameter.token !== ACCESS_TOKEN) {
    return ContentService.createTextOutput("ACCESS_DENIED_BY_WORM_AI").setMimeType(ContentService.MimeType.TEXT);
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // تحويل البيانات إلى JSON ثم تشفيرها Base64 لتمويه المحتوى
    const payload = JSON.stringify({
      timestamp: new Date().getTime(),
      results: data,
      status: "SECURE"
    });
    
    const encodedPayload = Utilities.base64Encode(payload, Utilities.Charset.UTF_8);

    return ContentService.createTextOutput(encodedPayload)
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (err) {
    return ContentService.createTextOutput("CRITICAL_ERROR").setMimeType(ContentService.MimeType.TEXT);
  }
}
