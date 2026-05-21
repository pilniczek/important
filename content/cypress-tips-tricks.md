---
title: "Cypress Tips & Tricks"
tags:
  - Testing
type:
  - How To
  - Archived
---

Řešil jsem v cypressu problém nekonzistentních testů [na locale] - často test neprovedl klik na viditelný element, protože mezi jeho nalezením a kliknutím došlo k re-renderu. Kvůli tomu test mnohem častěji neprošel, než prošel...
Zkoušel jsem nejrůznější řešení typu `...click({force:true})` a další... Překvapivě nejlepšího (bohužel stále ne 100%) řešení jsem dosáhnul změnou

`cy.get('selector')
	.should("exist")
	.scrollIntoView()
	.click({ force: true });`

na

`cy.get('selector').should("exist");
cy.get('selector').click();`
