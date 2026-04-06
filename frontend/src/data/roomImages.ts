const daySeed = Math.floor(Date.now() / 86400000);

const toSeededPhoto = (seed: number, width: number, height: number) => (
  `https://picsum.photos/seed/hotel-room-${seed}/${width}/${height}`
);

export const getRoomImageById = (roomId: number) => {
  const safeId = Number.isFinite(roomId) ? Math.abs(roomId) : 0;
  return toSeededPhoto(safeId + daySeed * 10, 1200, 800);
};

export const getRoomThumbById = (roomId: number) => {
  const safeId = Number.isFinite(roomId) ? Math.abs(roomId) : 0;
  return toSeededPhoto(safeId + daySeed * 10 + 1, 320, 320);
};
