export const ROLES = Object.freeze({
  ADMIN: 'admin',
  TRAVELLER: 'traveller',
  GUIDE: 'guide',
  INSTRUCTOR: 'instructor',
  ADVISOR: 'advisor'
});

export const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ONGOING: 'on_going',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
});

export const PAYMENT_STATUS = Object.freeze({
  CREATED: 'created',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
});

export const TARGET_TYPE = Object.freeze({
  ACTIVITY: 'activity',
  PLACE: 'place',
  GUIDE: 'guide'
});
