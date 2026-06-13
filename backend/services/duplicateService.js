const Issue = require('../models/Issue');

/**
 * Checks ~150m radius for existing unresolved issues of the same category.
 */
exports.checkDuplicate = async (latitude, longitude, category, radiusKm = 0.15) => {
  if (!latitude || !longitude) return false;

  const kmPerDegreeLat = 111;
  const kmPerDegreeLng = 111 * Math.cos(latitude * Math.PI / 180);

  const latDelta = radiusKm / kmPerDegreeLat;
  const lngDelta = radiusKm / kmPerDegreeLng;

  const match = await Issue.findOne({
    category,
    status: { $ne: 'Resolved' },
    latitude: { $gte: latitude - latDelta, $lte: latitude + latDelta },
    longitude: { $gte: longitude - lngDelta, $lte: longitude + lngDelta }
  });

  return !!match;
};
