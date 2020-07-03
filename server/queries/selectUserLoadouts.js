// returns the loadouts that a given user has access to
module.exports = function selectUserLoadouts(userId) {
   return `
      SELECT
         users.email,
         loadouts.name AS loadout_name
      FROM
         users
      INNER JOIN
         xref_user_loadouts ON user_id = users.id
      INNER JOIN
         loadouts ON loadouts.id = xref_user_loadouts.loadout_id
      WHERE
         users.id = '${userId}'
      `;
};
