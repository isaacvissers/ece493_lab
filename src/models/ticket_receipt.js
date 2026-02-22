function generateTicketReceiptId() {
  return `tkt_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createTicketReceipt({
  id = null,
  registrationId = null,
  conferenceName = 'Conference Registration',
  attendeeName = '',
  ticketType = '',
  amountPaid = 0,
  transactionReference = null,
  issuedAt = null,
  format = 'html',
} = {}) {
  const timestamp = new Date().toISOString();
  return {
    id: id || generateTicketReceiptId(),
    registrationId,
    conferenceName,
    attendeeName,
    ticketType,
    amountPaid,
    transactionReference,
    issuedAt: issuedAt || timestamp,
    format,
  };
}
