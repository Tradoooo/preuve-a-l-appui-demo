/**
 * Le formulaire de refus : ses libellés exposés et son rendu sur petit écran.
 *
 * Le client refusé peut être une personne en situation de vulnérabilité : le
 * formulaire doit rester utilisable au clavier, annoncé par un lecteur d'écran,
 * et lisible sur un téléphone.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */

/** Les champs du formulaire de refus, avec leur libellé exposé. */
export const REFUSAL_FORM_FIELDS = Object.freeze([
  {
    name: 'cardholderName',
    label: 'Nom du titulaire',
    type: 'text',
    autocomplete: 'cc-name',
    required: true,
  },
  {
    name: 'cardNumber',
    label: 'Numéro de carte',
    type: 'text',
    inputmode: 'numeric',
    autocomplete: 'cc-number',
    required: true,
  },
  {
    name: 'expiryDate',
    label: "Date d'expiration",
    type: 'text',
    placeholder: 'MM/AA',
    autocomplete: 'cc-exp',
    required: true,
  },
  {
    name: 'refusalReason',
    label: 'Motif du refus',
    type: 'text',
    readonly: true,
    required: false,
  },
]);

/** Le rendu d'un champ : `<label for>` relié à l'identifiant du champ. */
export function renderField(field) {
  const id = `refusal-${field.name}`;
  const attributes = [
    `id="${id}"`,
    `name="${field.name}"`,
    `type="${field.type}"`,
    field.required ? 'required' : '',
    field.readonly ? 'readonly' : '',
    field.autocomplete ? `autocomplete="${field.autocomplete}"` : '',
    field.inputmode ? `inputmode="${field.inputmode}"` : '',
    field.placeholder ? `placeholder="${field.placeholder}"` : '',
  ].filter((part) => part !== '');
  return `<label for="${id}">${field.label}</label><input ${attributes.join(' ')}>`;
}

/**
 * Rend le formulaire de refus pour une largeur donnée.
 * En dessous de 640 px, une seule colonne : pas de défilement horizontal.
 */
export function renderRefusalForm({ viewportWidth = 1280, reason = '' } = {}) {
  const smallScreen = viewportWidth < 640;
  const columns = smallScreen ? 1 : 2;
  const fields = REFUSAL_FORM_FIELDS.map((field) => renderField(field)).join('');
  const html = [
    `<form class="refusal-form${smallScreen ? ' refusal-form--compact' : ''}"`,
    ` style="display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr))">`,
    fields,
    `<p class="refusal-reason">${reason}</p>`,
    '</form>',
  ].join('');
  return { html, columns, smallScreen, viewportWidth };
}
