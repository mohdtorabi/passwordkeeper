/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/sites,
 *   these routes are mounted onto /sites
 */

const express = require('express');
const router  = express.Router();

let global_site_id = 0;


module.exports = (db) => {

  // Display all the websites
  router.get("/:organization_id/sites", (req, res) => {
    console.log("diplay sites get request");
    const orgId = req.params.organization_id;
    console.log(orgId);
    let query = `SELECT * FROM websites WHERE organization_id=$1`;
    console.log(query);
    db.query(query, [orgId])
      .then(data => {
        const sites = data.rows;
        console.log(sites);
        res.render("sites", {sites: sites, orgId: orgId});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Add a new website
  router.post("/:organization_id/sites", (req, res) => {
    const record = req.body;
    const orgId = req.params.organization_id;
    console.log(req.session);
    console.log(req.params);
    console.log(record);

    const params = [orgId, record.category, record.name, record.username, record.password, record.email];
    const query = `INSERT INTO websites (organization_id, category_id, name, username, password, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

    console.log(query);
    db.query(query, params)
      .then(data => {
        console.log(data.rows[0]);
        res.redirect(`/organization/${orgId}/sites`);
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Deletes an entry
  router.post("/:organization_id/sites/:site/delete", (req, res) => {
    console.log(req.params.site);
    const site = [req.params.site];
    const orgId = req.params.organization_id;

    const query = `DELETE FROM websites WHERE name=$1`;
    console.log(query);

    db.query(query, site)
      .then(data => {
        console.log(data.rows[0]);
        res.redirect(`/organization/${orgId}/sites`);
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  // Shows the details of a site so it can be updated
  router.get("/:organization_id/sites/:site", (req, res) => {
    console.log(`Req params site: ${req.params.site}`);
    const sitename = [req.params.site];
    const orgId = req.params.organization_id;

    const query = `SELECT * FROM websites WHERE name=$1`;

    console.log(`Query: ${query}`);
    console.log(sitename);

    db.query(query, sitename)
      .then(data => {
        const site = data.rows[0]
        global_site_id = site.id;
        console.log("Global site id: " + global_site_id);
        res.render("site", {site, orgId});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Update a site entry
  router.post("/:organization_id/sites/:site/update", (req, res) => {
    console.log(req.body);
    site = [req.body];
    const orgId = req.params.organization_id;
    console.log(orgId);
    const params = [req.body.name, req.body.username, req.body.email, req.body.category, req.body.password, global_site_id]

    const query = `UPDATE websites SET name=$1, username=$2, email=$3, category_id=$4, password=$5  WHERE id=$6 RETURNING *`;
    console.log(query);

    db.query(query, params)
      .then(data => {
        console.log(data.rows[0]);
        res.redirect(`/organization/${orgId}/sites`);
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });




  return router;
};
