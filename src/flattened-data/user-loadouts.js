// this bridge table links users to loadouts (many-to-many relationship so users can share the same loadouts)
const userLoadouts = [
   {
      id: "",
      userId: "84fbbb78-b2a2-11ea-b3de-0242ac130004", // Chris
      loadoutId: "",
      canEdit: true,
      canPack: true,
      isAdmin: true, // can rename, delte, share, unshare, assign priveledges, etc.
   },
];
