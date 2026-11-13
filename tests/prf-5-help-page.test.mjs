/**
 * PRF-5 — la page d'aide : les motifs de refus, en français et en anglais.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REFUSAL_REASONS } from '../src/checkout.mjs';
import { HELP_PAGE_EN, HELP_PAGE_FR } from '../src/help-page.mjs';

test('help page lists the refusal reasons', () => {
  const listed = HELP_PAGE_FR.motifs.map((one) => one.reason);
  for (const reason of Object.values(REFUSAL_REASONS)) {
    assert.ok(listed.includes(reason), `motif absent de la page : ${reason}`);
  }
  assert.ok(HELP_PAGE_FR.steps.length >= 3);
  assert.ok(HELP_PAGE_FR.delay.length > 0);
  assert.ok(HELP_PAGE_FR.motifs.every((one) => one.explanation.length > 0));
});

test('help page is published in english', () => {
  assert.equal(HELP_PAGE_EN.locale, 'en');
  assert.notEqual(HELP_PAGE_EN.title, HELP_PAGE_FR.title);
  assert.deepEqual(
    HELP_PAGE_EN.motifs.map((one) => one.reason),
    HELP_PAGE_FR.motifs.map((one) => one.reason),
  );
  assert.ok(HELP_PAGE_EN.steps.length >= 3);
  assert.ok(HELP_PAGE_EN.delay.length > 0);
});
