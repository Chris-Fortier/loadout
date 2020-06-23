// this bridge table links users to loadouts (many-to-many relationship so users can share the same loadouts)
const userLoadouts = [
   {
      id: "5482d8fc-6e63-4d1d-a6ee-b82344507b52",
      userId: "84fbbb78-b2a2-11ea-b3de-0242ac130004", // Chris
      loadoutId: "42655170-7e10-4431-8d98-c2774f6414a4", // one-night camping trip
      canEdit: true,
      canPack: true,
      isAdmin: true, // can rename, delte, share, unshare, assign priveledges, etc.
   },
];
