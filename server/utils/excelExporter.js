const ExcelJS = require('exceljs');

/**
 * Generate Excel workbook buffer for event registrations
 * @param {Object} event
 * @param {Array} registrations
 * @returns {Promise<Buffer>}
 */
const generateEventRegistrationsExcel = async (event, registrations) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'EventSphere AI';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Registrations', {
    properties: { tabColor: { argb: '6366F1' } },
    pageSetup: { orientation: 'landscape' },
  });

  // Title block
  worksheet.mergeCells('A1:H1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `EventSphere AI - ${event.title} (Registration Report)`;
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4F46E5' },
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 40;

  // Metadata block
  worksheet.mergeCells('A2:H2');
  const metaCell = worksheet.getCell('A2');
  metaCell.value = `Date: ${new Date(event.date).toLocaleDateString()} | Venue: ${event.venue} | Total Registrations: ${registrations.length} | Exported: ${new Date().toLocaleString()}`;
  metaCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: '374151' } };
  metaCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'E0E7FF' },
  };
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(2).height = 24;

  // Header row
  const headers = [
    { header: 'Reg ID', key: 'regId', width: 28 },
    { header: 'Participant Name', key: 'name', width: 25 },
    { header: 'Email Address', key: 'email', width: 30 },
    { header: 'Payment Status', key: 'paymentStatus', width: 16 },
    { header: 'Order ID', key: 'orderId', width: 24 },
    { header: 'Check-in Status', key: 'checkInStatus', width: 18 },
    { header: 'Check-in Time', key: 'checkInTime', width: 22 },
    { header: 'Registered At', key: 'createdAt', width: 22 },
  ];

  worksheet.getRow(4).values = headers.map(h => h.header);
  worksheet.columns = headers;

  const headerRow = worksheet.getRow(4);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '312E81' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' },
    };
  });

  // Populate data
  registrations.forEach((reg, index) => {
    const row = worksheet.addRow({
      regId: reg._id ? reg._id.toString() : `REG-${index + 1}`,
      name: reg.participant?.name || 'N/A',
      email: reg.participant?.email || 'N/A',
      paymentStatus: reg.paymentStatus || 'Pending',
      orderId: reg.razorpayOrderId || 'N/A',
      checkInStatus: reg.checkInStatus ? 'Checked In' : 'Not Checked In',
      checkInTime: reg.checkInTime ? new Date(reg.checkInTime).toLocaleString() : '-',
      createdAt: reg.createdAt ? new Date(reg.createdAt).toLocaleString() : '-',
    });

    row.height = 22;
    const isEven = index % 2 === 0;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 || colNumber === 4 || colNumber === 6 ? 'center' : 'left' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'F9FAFB' : 'FFFFFF' },
      };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
      };

      // Status badges coloring
      if (colNumber === 4) {
        if (cell.value === 'Completed') {
          cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '047857' } };
        } else {
          cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'B45309' } };
        }
      }
      if (colNumber === 6) {
        if (cell.value === 'Checked In') {
          cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '047857' } };
        } else {
          cell.font = { name: 'Arial', size: 10, color: { argb: '6B7280' } };
        }
      }
    });
  });

  return await workbook.xlsx.writeBuffer();
};

module.exports = {
  generateEventRegistrationsExcel,
};
