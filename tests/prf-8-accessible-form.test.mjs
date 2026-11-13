/**
 * PRF-8 — le formulaire de refus : libellés exposés, rendu sur petit écran.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REFUSAL_FORM_FIELDS, renderRefusalForm } from '../src/form.mjs';

test('refusal form exposes accessible labels', () => {
  const { html } = renderRefusalForm({ viewportWidth: 1280 });
  assert.ok(html.includes('<label for='));
  for (const field of REFUSAL_FORM_FIELDS) {
    const id = `refusal-${field.name}`;
    assert.ok(field.label.trim().length > 0, `libellé vide : ${field.name}`);
    assert.ok(html.includes(`for="${id}"`), `libellé non relié : ${field.name}`);
    assert.ok(html.includes(`id="${id}"`), `champ sans identifiant : ${field.name}`);
  }
});

test('refusal form renders on small screens', () => {
  const small = renderRefusalForm({ viewportWidth: 360, reason: 'carte expirée' });
  assert.equal(small.smallScreen, true);
  assert.equal(small.columns, 1);
  assert.ok(small.html.includes('refusal-form--compact'));
  assert.equal(/grid-template-columns:repeat\(2/.test(small.html), false);
  const large = renderRefusalForm({ viewportWidth: 1280 });
  assert.equal(large.smallScreen, false);
  assert.equal(large.columns, 2);
});
