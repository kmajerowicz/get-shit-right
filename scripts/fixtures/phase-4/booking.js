'use strict';
// Synthetic CLI/API product: caller owns the in-memory repository.
function reserve(input, repository) {
  if (!input.account) throw new Error('Account required');
  if (!['09:00', '10:30'].includes(input.time)) throw new Error('Invalid time');
  const booking = { name: input.name, time: input.time };
  repository.push(booking);
  return booking;
}
module.exports = { reserve };
